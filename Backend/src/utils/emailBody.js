export const otpEmailBody = (username, otp) => {
return `Dear ${username},

Thank you for registering with PostApp. To complete your registration, please use the following One-Time Password (OTP): \n 

Your OTP Code: ${otp} \n 

This code is valid for the next 30 minutes.

If you did not attempt to register, please ignore this email or contact us immediately at dheeraazacharya273@gmail.com to report any unauthorized activity.

Best regards,
The PostApp Team`
}

export const welcomeEmailBody = (username) => {
return `Dear ${username},

Congratulations! Your email address has been successfully verified, and your registration with PostApp is now complete. 🎉\n

Welcome to PostApp! We are thrilled to have you as part of our community. As a registered user, you can now access all the features and services we offer.\n

If you have any questions or encounter any issues, feel free to contact us at support@postapp.com.\n

Thank you for choosing PostApp. We look forward to serving you! \n

Best regards,
The PostApp Team`
}