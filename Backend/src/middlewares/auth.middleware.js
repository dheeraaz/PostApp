import { asyncHandler, apiError, apiResponse } from "../utils/index.js";
import { cookieOptions } from "../constants/constants.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accesstoken ||
    req.header("Authorization")?.replace("Bearer ", "");

  // checking if there is token or not
  if (!token) throw new apiError(401, "Unauthorized Request");

  try {
    // this line  will throw a TokenExpiredError if the token has expired and nothing is assigned to decodedToken
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // user is obtained only if token is valid
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshtoken"
    );

    // here the token is within expiry limit but still user is not fetched due to some reason
    // this error is catched by catch block below
    if (!user) throw new apiError(401, "Invalid Access Token");

    // if the user is valid and available, add the user into req and send it to next()
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      //here token has expired, so proceed to take necessary action
      res
        .status(200)
        .clearCookie("accesstoken", cookieOptions)
        .json(new apiResponse(204, null, "Session Expired, Logged Out"));
    } else {
      throw new apiError(401, "Invalid Token");
    }
  }
});

export { verifyJWT };
