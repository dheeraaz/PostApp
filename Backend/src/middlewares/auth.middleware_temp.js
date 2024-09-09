import { asyncHandler, apiError, apiResponse } from "../utils/index.js";
import { cookieOptions } from "../constants/constants.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";
import { generateAccessAndRefreshToken } from "../utils/tokenUtils.js"; // Assuming you have this function in a separate file

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");
    const refreshToken = req.cookies?.refreshtoken; // Assuming you store the refresh token in a cookie

    if (!token) throw new apiError(401, "Unauthorized Request");

    try {
        // Check if the access token is valid
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Fetch user
        const user = await User.findById(decodedToken._id).select("-password -refreshtoken");
        if (!user) throw new apiError(401, "Invalid Access Token");

        // Attach user to request
        req.user = user;
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            // Handle expired access token
            if (!refreshToken) {
                // If no refresh token is present, clear access token and respond
                res
                    .status(200)
                    .clearCookie("accesstoken", cookieOptions)
                    .json(new apiResponse(204, null, "Session Expired, Logged Out"));
                return;
            }

            // Verify refresh token
            try {
                const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

                // Fetch user by ID from refresh token
                const user = await User.findById(decodedRefreshToken._id).select("-password -refreshtoken");
                if (!user || user.refreshtoken !== refreshToken) {
                    throw new apiError(401, "Invalid Refresh Token");
                }

                // Generate new tokens
                const { accesstoken, refreshtoken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

                // Save new refresh token to user's document
                user.refreshtoken = newRefreshToken;
                await user.save({ validateBeforeSave: false });

                // Set new tokens in cookies
                res.cookie("accesstoken", accesstoken, cookieOptions);
                res.cookie("refreshtoken", newRefreshToken, cookieOptions);

                // Attach user to request
                req.user = user;
                next();

            } catch (refreshTokenError) {
                // If refresh token is invalid or expired
                console.log("refresh token expired===>", refreshTokenError)
                res
                    .status(200)
                    .clearCookie("accesstoken", cookieOptions)
                    .clearCookie("refreshtoken", cookieOptions)
                    .json(new apiResponse(204, null, "Session Expired, Logged Out"));
            }
        } else {
            // If error is not related to token expiration
            throw new apiError(401, "Invalid Token");
        }
    }
});

export { verifyJWT };
