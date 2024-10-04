import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import { PwdReset } from "../models/pwd_reset.model.js";
import {
  asyncHandler,
  apiError,
  apiResponse,
  sendEmail,
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/index.js";
import {
  otpEmailBody,
  welcomeEmailBody,
  pwdResetEmailBody,
  pwdResetSuccessEmailBody,
} from "../utils/emailBody.js";
import { cookieOptions } from "../constants/constants.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import logger from "../utils/logger.js";

//function for generating access token and refresh token
const generateAccessAndRefreshToken = async (userid) => {
  try {
    const user = await User.findById(userid);

    if (!user) throw new apiError(404, "User Doesn't Exist");

    const accesstoken = await user.generateAccessToken();
    const refreshtoken = await user.generateRefreshToken();

    // saving refreshToken in user's document
    user.refreshtoken = refreshtoken;
    //while manually updating only one field in models, they try to re-validate all the fields [where = required:true] is set, which will give an error
    // so to prevent validation before save, {validateBeforeSave:false}
    user.save({ validateBeforeSave: false });

    return {
      accesstoken,
      refreshtoken,
    };
  } catch (error) {
    logger.error("Error in generating access and refresh token==>", error);
    throw new apiError(500, "Error In Generating Access And Refresh Token");
  }
};

//function for generating otp code
const generateOTP = (otpLength) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let otp = "";
  for (let i = 0; i < otpLength; i++) {
    otp += numbers[crypto.randomInt(numbers.length)];
  }
  return otp;
};

// this is used for managing protected route in frontend
const isUserLoggedIn = asyncHandler(async (req, res) => {
  //  if there is valid and unexpired accessToken present, then we will get user details in req.user obtained from auth middleware
  return res
    .status(200)
    .json(new apiResponse(201, req.user, "User Is Logged In"));
});

// =====================Start: Authentication and Authorization=================
//registering user
const registerUser = asyncHandler(async (req, res) => {
  // getting the data entered by user
  const { username, email, age, password } = req.body;

  // checking if the user is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new apiError(409, "User Already Exists");

  const newUser = await User.create({
    username,
    email,
    age,
    password,
  });

  // checking if the user is created or not
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshtoken"
  );
  if (!createdUser)
    throw new apiError(500, "Something Went Wrong While Registering User");

  //  generate 6 digit otp code
  const otpcode = generateOTP(6);

  // saving otpcode[encrypted] and user's email id otp collection
  await Otp.create({
    email: createdUser.email,
    otpcode,
  });

  // here, even if the email is not sent, user is registered and later email is sent while he tries to login
  // since sendEmail is an aynchronous function, and it will be executed asynchronously returning function
  // if we use await keyword, it will wait for the completion of sendEmail function, which will increase the api response time
  const sendEmailPromise = sendEmail(
    createdUser.email,
    "Email Verification: postApp",
    otpEmailBody(createdUser.username, otpcode)
  );

  // Here, the response is first sent, then email is sent and promise is resolved increasing the api response time
  sendEmailPromise
    .then((isEmailSent) => {
      if (!isEmailSent)
        logger.warn(
          "Email couldn't be sent - confirmation email of password reset"
        );
    })
    .catch((err) => logger.error("Error sending email: ", err));

  // otpToken generation [saving user's email id in token is enough]
  const otpToken = await createdUser.generateOtpToken();

  // sending api response
  res
    .status(200)
    .cookie("otptoken", otpToken, { ...cookieOptions, maxAge: 30 * 60 * 1000 })
    .json(
      new apiResponse(
        201,
        {},
        `Successfully Registered User \n Please Verify Your Email`
      )
    );
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  // getting the data entered by user
  const { email, password } = req.body;
  // checkinng if the user is already registered
  const user = await User.findOne({ email });
  if (!user) throw new apiError(404, "Invalid User Credentials -E");

  // checking if the password entered by user is correct or not
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new apiError(404, "Invalid User Credentials -P");

  // checking if the user is verified or not, if not verified sending email for verification
  if (!user.isVerified) {
    //  generate 6 digit otp code
    const otpcode = generateOTP(6);

    // Hash the OTP code before updating the document [.pre("save") doesnt work on findOneAndUpdate]
    const hashedOtpcode = await bcrypt.hash(otpcode, 10);

    // here, in otp collections, if email already exists, then only otp field is updated [encrypted before save]
    // But, if the document has expired, and no such email is found then new document is created
    await Otp.findOneAndUpdate(
      { email: user.email }, // Filter by email
      {
        $set: { otpcode: hashedOtpcode }, // Update the OTP field
        $setOnInsert: { email: user.email }, // Set the email field only if inserting
      },
      {
        new: true, // Return the updated or newly created document
        upsert: true, // Create a new document if no match is found
        setDefaultsOnInsert: true, // Set default values if creating a new document
      }
    );

    // while logging, if the user is not verified, we will wait till the email with otp code is sent to user
    const isEmailSent = await sendEmail(
      user.email,
      "Email Verification",
      otpEmailBody(user.username, otpcode)
    );
    if (!isEmailSent)
      throw new apiError(
        500,
        `Verification email couldn't be sent \n Please retry after some time`
      );

    // otpToken generation [only user's email id is enough in token]
    const otpToken = await user.generateOtpToken();

    // sending api response to unverified user
    return res
      .status(200)
      .cookie("otptoken", otpToken, {
        ...cookieOptions,
        maxAge: 30 * 60 * 1000,
      })
      .json(
        new apiResponse(
          202,
          {},
          `User is not verified \n Please Verify Your Email`
        )
      );
  }

  // creating access and refresh token
  const { refreshtoken, accesstoken } = await generateAccessAndRefreshToken(
    user._id
  );

  // Again finding the logged in user by removing password and refreshtoken field
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  // sending api response to verified user
  res
    .status(200)
    .cookie("accesstoken", accesstoken, cookieOptions)
    .cookie("refreshtoken", refreshtoken, cookieOptions)
    .json(new apiResponse(201, loggedInUser, "Successfully LoggedIn User"));
});

//verify user
const verifyEmail = asyncHandler(async (req, res) => {
  // otpToken saved in user's browser
  const otpToken = req?.cookies?.otptoken;
  if (!otpToken) throw new apiError(401, "Unauthorized Request");

  // receiving otpFields sent from frontend
  const { otpFields } = req.body;

  // converting Otp fields into string
  const otpSentByUser = otpFields.join("");

  // checking if the otpToken is valid or not
  const decodedToken = await jwt.verify(otpToken, process.env.OTP_TOKEN_SECRET);

  // finding the otp document saved in database
  const otpDocument = await Otp.findOne({ email: decodedToken.email });

  if (!otpDocument) throw new apiError(401, "Unauthorized Request");

  // decrpting the otp stored in database || bcrypt stores everything as string
  const isOtpValid = await bcrypt.compare(otpSentByUser, otpDocument.otpcode);

  if (!isOtpValid) throw new apiError(401, "Otp Doesn't Match");

  // now update the user to verified, generate access token and refresh token and proceed user to login [no need to login again]
  const verifiedUser = await User.findOneAndUpdate(
    { email: decodedToken.email },
    { $set: { isVerified: true } },
    { new: true }
  );

  // creating access and refresh token //also saves refresh token in user's document
  const { refreshtoken, accesstoken } = await generateAccessAndRefreshToken(
    verifiedUser._id
  );
  //  delete the otp document from database
  await Otp.findOneAndDelete({ email: decodedToken.email });

  // Again finding the logged in user by removing password and refreshtoken field
  const loggedInUser = await User.findById(verifiedUser._id).select(
    "-password -refreshtoken"
  );

  // asynchronously handling the sendEmail function [response is sent first, then email is sent]
  const sendEmailPromise = sendEmail(
    loggedInUser.email,
    "Welcome Email - postApp",
    welcomeEmailBody(loggedInUser.username)
  );

  // handling the sendEmailPromise once the response is sent to user
  sendEmailPromise
    .then((isEmailSent) => {
      if (!isEmailSent)
        logger.warn(
          "Email couldn't be sent - confirmation email of password reset"
        );
    })
    .catch((err) => logger.error("Error sending email: ", err));

  // sending api response to verified+loggedIn user and clearing otpToken from Browser
  res
    .status(200)
    .clearCookie("otptoken", cookieOptions)
    .cookie("accesstoken", accesstoken, cookieOptions)
    .cookie("refreshtoken", refreshtoken, cookieOptions)
    .json(new apiResponse(200, loggedInUser, "Successfully LoggedIn User"));
});

//handling password forgot related credentials and sending email
const forgotPassword = asyncHandler(async (req, res) => {
  // getting the email address entered by user
  const { email } = req.body;

  // checking if the user is valid or not
  const isvalidUser = await User.findOne({ email });

  if (!isvalidUser)
    throw new apiError(404, "Invalid User Credentials - User doesn't exists");

  // generating token with user's email
  const pwdResetToken = await isvalidUser.generatePwdResetToken();

  //Now save the email and pwdResetToken in PwdReset collections for futher validation
  // Here the old docs is replaced by new one, if the document with same email is already present and
  // new document created if no such document is found
  const resetDocs = await PwdReset.findOneAndUpdate(
    { email: isvalidUser.email }, //filter by email
    { $set: { pwdResetToken } }, //Replace or update the pwdResetToken field
    { upsert: true, new: true } // Create a new document if no match is found, return the new document
  );
  if (!resetDocs)
    throw new apiError(500, "Internal server error while resetting password");

  const resetPwdRoute = `${process.env.CORS_ORIGIN}/resetpassword/${pwdResetToken}`;
  // sending email to user with reset link to reset his/password;
  const sendEmailPromise = sendEmail(
    isvalidUser.email,
    "Password Reset Request for PostApp",
    pwdResetEmailBody(isvalidUser.username, resetPwdRoute)
  );

  sendEmailPromise
    .then((isEmailSent) => {
      if (!isEmailSent)
        logger.warn(
          "Email couldn't be sent - confirmation email of password reset"
        );
    })
    .catch((err) => logger.error("Error sending email: ", err));

  res
    .status(200)
    .json(new apiResponse(204, {}, "Successfully sent password reset email"));
});

//resetting user's password
const resetPassword = asyncHandler(async (req, res) => {
  const { password: newPassword, pwdResetToken } = req.body;

  // checking if the token is valid or not
  const decodedResetId = await jwt.verify(
    pwdResetToken,
    process.env.RESET_PWD_TOKEN_SECRET
  );
  const { email: userEmail } = decodedResetId;

  // checking if the reset password document has been deleted or not
  // preventing user to reset password with same link for multiple times
  const pwdResetDocs = await PwdReset.findOne({ email: userEmail });
  if (!pwdResetDocs) throw new apiError(401, "Unauthorized Request");

  // checking if both the token are same or not
  if (pwdResetToken !== pwdResetDocs.pwdResetToken)
    throw new apiError(401, "Unauthorized Request");

  // resetting user's password

  // This will not trigger pre("save") hook, it is triggered only for methods like: save() or create()
  // const user = await User.findOneAndUpdate({ email: userEmail }, { $set: { password: newPassword } });

  const user = await User.findOne({ email: userEmail });
  if (!user) throw new apiError(404, "User Not Found");

  // checking if the new password entered by user is same as previous one
  // isPasswordCorrect returns true if newPassword and saved password are same
  const isPasswordNew = await user.isPasswordCorrect(newPassword);
  if (isPasswordNew)
    throw new apiError(
      400,
      "New password cannot be the same as the old password."
    );

  //   if newPassword is not same as old one, then save it
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  //after resetting user's password, delete the pwd_reset docs from database
  // even if the document is not present this delete operation will cause no error
  await PwdReset.deleteOne({ email: userEmail });

  // even if the email is not sent, continue the response
  // since sendEmail is an aynchronous function, and it will be executed asynchronously returning function
  // if we use await keyword, it will wait for the completion of sendEmail function, which will increase the api response time
  const sendEmailPromise = sendEmail(
    userEmail,
    "Your Password Has Been Successfully Changed",
    pwdResetSuccessEmailBody(user.username)
  );

  // Here, the response is first sent, then email is sent and promise is resolved increasing the api response time
  sendEmailPromise
    .then((isEmailSent) => {
      if (!isEmailSent)
        logger.warn(
          "Email couldn't be sent - confirmation email of password reset"
        );
    })
    .catch((err) => logger.error("Error sending email: ", err));

  res
    .status(200)
    .json(new apiResponse(204, {}, "Successfully Changed the password"));
});

// logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshtoken: "" } },
    { new: true }
  );

  res
    .status(200)
    .clearCookie("accesstoken", cookieOptions)
    .clearCookie("refreshtoken", cookieOptions)
    .json(new apiResponse(202, {}, "User Logged Out Successfully"));
});

// =====================End: Authentication and Authorization=================

// for refreshing access token using refresh token of user
const refreshTokens = asyncHandler(async (req, res) => {
  const refToken = req?.cookies?.refreshtoken;

  if (!refToken)
    throw new apiError(401, "Unauthorized Request - no refresh token");

  try {
    const decodedRefToken = await jwt.verify(
      refToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefToken._id);

    if (!user) throw new apiError(404, "User not found");

    // this will generate both access token and refresh token, updates refreshtoken in database and also handles the error
    const { refreshtoken, accesstoken } = await generateAccessAndRefreshToken(
      user._id
    );

    res
      .status(200)
      .cookie("accesstoken", accesstoken, cookieOptions)
      .cookie("refreshtoken", refreshtoken, cookieOptions)
      .json(
        new apiResponse(200, {}, "Successfully refreshed the access token")
      );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Clear cookies if refresh token has expired
      res.clearCookie("accesstoken", cookieOptions);
      res.clearCookie("refreshtoken", cookieOptions);

      // Inform the frontend to log the user out
      throw new apiError(
        401,
        `Session Expired \nPlease Login Again`,
        "",
        "SessionExpired"
      );
    } else {
      throw new apiError(
        error?.statusCode || 401,
        error?.message || "Unauthorized User"
      );
    }
  }
});

// For Updating Profile Picture
const updateProfilePic = asyncHandler(async (req, res) => {
  // console.log(req.file);
  // console.log(req.body.originalProfileUrl);

  const profilePicLocalPath = req?.file?.path;

  if (!profilePicLocalPath)
    throw new apiError(400, "Profile picture not uploaded");

  const profilePic = await uploadOnCloudinary(profilePicLocalPath);

  if (!profilePic.secure_url)
    throw new apiError(500, "Image couldn't be uploaded at current moment");

  if (req?.body?.originalProfileUrl !== "/images/default_profile.jpg") {
    deleteFromCloudinary(req?.body?.originalProfileUrl)
      .then((result) => {
        if (!result) {
          logger.error("Failed to delete the image from Cloudinary.");
        }
      })
      .catch((error) => {
        logger.error("Error deleting image from Cloudinary", error);
      });
  }

  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    { $set: { profilepic: profilePic.secure_url } },
    { new: true }
  ).select("-password -refreshtoken");

  res
    .status(200)
    .json(new apiResponse(201, user, "Successfully Updated User's profile"));
});

// for updating cover photo
const updateCoverPic = asyncHandler(async (req, res) => {
  // console.log(req.file);
  // console.log(req.body.originalCoverUrl);

  const coverPicLocalPath = req?.file?.path;

  if (!coverPicLocalPath) throw new apiError(400, "Cover picture not uploaded");

  const coverPic = await uploadOnCloudinary(coverPicLocalPath);

  if (!coverPic.secure_url)
    throw new apiError(500, "Image couldn't be uploaded at current moment");

  if (req?.body?.originalCoverUrl !== "/images/default_cover.jpg") {
    deleteFromCloudinary(req?.body?.originalCoverUrl)
      .then((result) => {
        if (!result) {
          logger.error("Failed to delete the image from Cloudinary.");
        }
      })
      .catch((error) => {
        logger.error("Error deleting image from Cloudinary", error);
      });
  }

  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    { $set: { coverpic: coverPic.secure_url } },
    { new: true }
  ).select("-password -refreshtoken");

  res
    .status(200)
    .json(
      new apiResponse(201, user, "Successfully Updated User's Cover Image")
    );
});

// get user info

const getUserInfo = asyncHandler(async (req, res) => {
  const userId = req?.params?.userId;

  if (!userId) throw new apiError(400, "UserId not provided");

  const user = await User.findById(userId).select("-password -refreshtoken");

  if (!user) throw new apiError(404, "User not found");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Successfully fetched user info"));
});

export {
  isUserLoggedIn,
  registerUser,
  loginUser,
  verifyEmail,
  logoutUser,
  forgotPassword,
  resetPassword,
  refreshTokens,
  updateProfilePic,
  updateCoverPic,
  getUserInfo,
};
