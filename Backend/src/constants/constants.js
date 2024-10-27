export const _DB_Name = "postApp";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "None",
};

export const maximumImagecount = 6;
