import {User} from '../models/user.model.js'
import {asyncHandler, apiError, apiResponse} from '../utils/index.js'
import { cookieOptions } from '../constants/constants.js';

//function for generating access token and refresh token
const generateAccessAndRefreshToken = async (userid)=>{
  try {
      const user = await User.findById(userid);
  
      if(!user) throw new apiError(404, "User Doesn't Exist")

      const accesstoken = await user.generateAccessToken();
      const refreshtoken = await user.generateRefreshToken();

      // saving refreshToken in user's document
      user.refreshtoken = refreshtoken;
      //while manually updating only one field in models, they try to re-validate all the fields [where = required:true] is set, which will give an error
      // so to prevent validation before save, {validateBeforeSave:false}
      user.save({validateBeforeSave:false})
  
      return {
          accesstoken,
          refreshtoken,
      }
  } catch (error) {
    console.log(error);
    throw new apiError(500, "Error In Generating Access And Refresh Token")
  }

}

//registering user
const registerUser = asyncHandler(async(req, res)=>{
    // getting the data entered by user
    const {username, email, age, password} = req.body;

    // checking if the user is already registered
    const existingUser = await User.findOne({email});
    if(existingUser) throw new apiError(409, "User Already Exists");

    const newUser = await User.create({
        username,
        email,
        age,
        password
    })

    // checking if the user is created or not
    const createdUser = await User.findById(newUser._id).select("-password -refreshtoken");
    if(!createdUser) throw new apiError(500, "Something Went Wrong While Registering User");
    
    // sending api response
    res
    .status(200)
    .json(new apiResponse(201, createdUser ,"Successfully Registered User"))
  
})

// login user
const loginUser = asyncHandler(async(req, res)=>{
    // getting the data entered by user
    const {email, password} = req.body;

    // checkinng if the user is already registered
    const user = await User.findOne({email});
    if(!user) throw new apiError(404, "Invalid User Credentials -E");

    // checking if the password entered by user is correct or not
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) throw new apiError(404, "Invalid User Credentials -P"); 

    // creating access and refresh token
    const {refreshtoken, accesstoken} = await generateAccessAndRefreshToken(user._id);

    // Again finding the logged in user by removing password and refreshtoken field
    const loggedInUser = await User.findById(user._id).select("-password -refreshtoken")
    
    
    // sending api response
    res
    .status(200)
    .cookie("accesstoken", accesstoken, cookieOptions)
    .cookie("refreshtoken", refreshtoken, cookieOptions)
    .json(new apiResponse(201, loggedInUser ,"Successfully LoggedIn User"))
  
})
// login user
const logoutUser = asyncHandler(async(req, res)=>{
    await User.findByIdAndUpdate(req.user._id, {$unset:{refreshtoken:""}}, {new:true});

    res
    .status(200)
    .clearCookie("accesstoken", cookieOptions)
    .clearCookie("refreshtoken", cookieOptions)
    .json(new apiResponse(201, {}, "User Logged Out Successfully" ))


})

export {
    registerUser,
    loginUser,
    logoutUser,
}