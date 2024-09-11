import { z } from "zod";

// here refine function is used in object level, so that we can have access to both password and confirm_password
const registerSchema = z
  .object({
    username: z
      .string({ required_error: "Username is required" })
      .trim()
      .min(3, { message: "Username must be atleast 3 characters" })
      .max(40, { message: "Username must be less than 40 characters" }),

    age: z
      .string({ required_error: "Age is required" })
      .trim()
      .refine(
        (age) => {
          const parsedAge = parseInt(age, 10); //10 for decimal, 16 for hexadecimal
          return !isNaN(parsedAge) && parsedAge >= 12;
        },
        {
          message: "Age must be a valid number and at least 12",
        }
      ),

    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email({ message: "Invalid email address" })
      .min(3, { message: "Email must be at least of 4 characters" })
      .max(90, { message: "Email cannot be more than 255 characters" }),

    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "password must be of atleast of 8 characters" })
      .max(60, { message: "password must be of atleast of 60 characters" }),

    confirm_password: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine(
    (allData) => {
      return allData.password === allData.confirm_password;
    },
    {
      path: ["confirm_password"], // Path to indicate where the error will be shown, here error will be shown in confirm_password field
      message: "Passwords donot match",
    }
  );

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least of 4 characters" })
    .max(90, { message: "Email cannot be more than 255 characters" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "password must be of atleast of 8 characters" })
    .max(60, { message: "password must be of atleast of 60 characters" }),
});

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least of 4 characters" })
    .max(90, { message: "Email cannot be more than 255 characters" }),
});

const otpSchema = z.object({
  otpFields: z
    .array(
      z
        .string()
        .trim()
        .min(1, { message: "Each OTP field must be a non-empty string" })
        .regex(/^\d+$/, { message: "Each OTP field must be a number" })
    )
    .nonempty({ message: "OTP fields cannot be empty" }),
});

const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "password must be of atleast of 8 characters" })
      .max(60, { message: "password must be of atleast of 60 characters" }),

    confirm_password: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine(
    (allData) => {
      return allData.password === allData.confirm_password;
    },
    {
      path: ["confirm_password"], // Path to indicate where the error will be shown, here error will be shown in confirm_password field
      message: "Passwords donot match",
    }
  );

export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  otpSchema,
  resetPasswordSchema,
};
