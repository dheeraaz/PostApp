export const otpEmailBody = (username, otp) => {
return `Dear ${username},

Thank you for registering with PostApp. To complete your registration, please use the following One-Time Password (OTP): \n 

Your OTP Code: ${otp} \n 

This code is valid for the next 30 minutes.

If you did not attempt to register, please ignore this email or contact us immediately at dheeraazacharya273@gmail.com to report any unauthorized activity.

Best regards,
The PostApp Team`
}