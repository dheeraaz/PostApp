import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: process.env.EMAIL_SMTP_PORT,
  secure: process.env.EMAIL_SMTP_PORT === 456, //secure is set to true only if SMTP port is set to 456
  auth: {
    user: process.env.SENDER_EMAIL_ADDRESS,
    pass: process.env.EMAIL_SECURE_PASSWORD,
  },
});

const sendEmail = async (receiverEmail, emailSubject, emailBody) => {
  try {
    const mailOptions = {
      from: {
        name: "PostApp",
        address: process.env.SENDER_EMAIL_ADDRESS,
      },
      to: receiverEmail,
      subject: emailSubject,
      text: emailBody,
    };

    await transporter.sendMail(mailOptions);
    return true; // Return true if email is sent
  } catch (error) {
    console.error("Error sending email: ", error);
    return false; // Return false if there's an error
  }
};

export { sendEmail };
