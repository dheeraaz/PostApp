import { Router } from "express";

//importing middleware and controllers
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { multerUpload } from "../middlewares/multer.middleware.js";
import {
  registerUser,
  loginUser,
  verifyEmail,
  logoutUser,
  forgotPassword,
  resetPassword,
  isUserLoggedIn,
  refreshTokens,

  updateProfilePic,
  updateCoverPic,
} from "../controllers/user.controller.js";

import { validateWithSchema } from "../middlewares/zod_validator.middleware.js";
import {
  registerSchema,
  loginSchema,
  otpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validator-schema/zod_validator.schema.js";
const router = Router();

// declaring routes
router
  .route("/register")
  .post(validateWithSchema(registerSchema), registerUser);
router.route("/login").post(validateWithSchema(loginSchema), loginUser);
router.route("/verifyemail").post(validateWithSchema(otpSchema), verifyEmail);
router
  .route("/forgotpassword")
  .post(validateWithSchema(forgotPasswordSchema), forgotPassword);
router
  .route("/resetpassword")
  .post(validateWithSchema(resetPasswordSchema), resetPassword);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/isuserloggedin").get(verifyJWT, isUserLoggedIn);

router.route("/refreshtokens").post(refreshTokens);

router
  .route("/updateprofilepic")
  .patch(verifyJWT, multerUpload.single("profilepic"), updateProfilePic);

router
  .route("/updatecoverpic")
  .patch(verifyJWT, multerUpload.single("coverpic"), updateCoverPic);

export default router;
