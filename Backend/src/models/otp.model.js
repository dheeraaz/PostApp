import mongoose from "mongoose";
import bcrypt from "bcrypt";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otpcode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 1800, //document is automatically removed after 30min of creation
  },
});

otpSchema.pre("save", async function (next) {
  if (!this.isModified("otpcode")) return next();

  this.otpcode = await bcrypt.hash(this.otpcode, 10);
  next();
});

export const Otp = mongoose.model("Otp", otpSchema);
