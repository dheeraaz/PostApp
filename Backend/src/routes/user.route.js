import { Router } from "express";

//importing middleware and controllers
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  verifyEmail,
  logoutUser,
} from "../controllers/user.controller.js";

import { validateWithSchema } from "../middlewares/zod_validator.middleware.js";
import {
  registerSchema,
  loginSchema,
  otpSchema,
} from "../validator-schema/zod_validator.schema.js";
const router = Router();

// declaring routes
router
  .route("/register")
  .post(validateWithSchema(registerSchema), registerUser);
router.route("/login").post(validateWithSchema(loginSchema), loginUser);
router.route("/verifyemail").post(validateWithSchema(otpSchema), verifyEmail);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
