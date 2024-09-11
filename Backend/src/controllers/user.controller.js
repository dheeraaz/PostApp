import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import { asyncHandler, apiError, apiResponse, sendEmail } from "../utils/index.js";
import { otpEmailBody } from "../utils/emailBody.js";
import { cookieOptions } from "../constants/constants.js";
import bcrypt from 'bcrypt'
import crypto from 'crypto'

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
        console.log(error);
        throw new apiError(500, "Error In Generating Access And Refresh Token");
    }
};

//function for generating otp code

const generateOTP = (otpLength) => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
        otp += numbers[crypto.randomInt(numbers.length)];
    }
    return otp;
}


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
    if (!createdUser) throw new apiError(500, "Something Went Wrong While Registering User");

    //  generate 6 digit otp code
    const otpcode = generateOTP(6);

    // saving otpcode[encrypted] and user's email id otp collection
    await Otp.create({
        email: createdUser.email,
        otpcode,
    })

    const isEmailSent = await sendEmail(createdUser.email, "Email Verification", otpEmailBody(createdUser.username, otpcode))
    if (!isEmailSent) console.log("Email Couldn't be sent")

    // otpToken generation
    const otpToken = await createdUser.generateOtpToken(otpcode);

    // sending api response
    res
        .status(200)
        .cookie("otpToken", otpToken, { ...cookieOptions, maxAge: 30 * 60 * 1000 })
        .json(
            new apiResponse(
                201,
                "",
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

        // here, otp if email already exists, then only otp field is updated [encrypted before save]
        // But, if the document has expired, and no such email is found then new document is created
        await Otp.findOneAndUpdate(
            { email: user.email }, // Filter by email
            {
                $set: { otpcode:hashedOtpcode }, // Update the OTP field
                $setOnInsert: { email: user.email } // Set the email field only if inserting
            },
            {
                new: true, // Return the updated or newly created document
                upsert: true, // Create a new document if no match is found
                setDefaultsOnInsert: true, // Set default values if creating a new document
            }
        );

        const isEmailSent = await sendEmail(user.email, "Email Verification", otpEmailBody(user.username, otpcode))
        if (!isEmailSent) console.log("Email Couldn't be sent")

        // otpToken generation
        const otpToken = await user.generateOtpToken(otpcode);

        // sending api response to unverified user
        return res
        .status(200)
        .cookie("otpToken", otpToken, { ...cookieOptions, maxAge: 30 * 60 * 1000 })
        .json(new apiResponse(202,"",`User is not verified \n Please Verify Your Email`));
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
        .json(new apiResponse(200, loggedInUser, "Successfully LoggedIn User"));
});
// login user
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
        .json(new apiResponse(201, {}, "User Logged Out Successfully"));
});

export { registerUser, loginUser, logoutUser };
