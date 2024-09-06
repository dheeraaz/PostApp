import "dotenv/config";
import { app } from "./app.js";

import connectDB from "./db/dbConnection.js";
// import { sendMail } from "./utils/sendEmail.js";
// const mailOptions = {
//   from: {
//       name: "PostApp",
//       address: "dhirajacharya000@gmail.com"
//   },
//   to: ["dheeraazacharya273@gmail.com", "076bct023.dhiraj@pcampus.edu.np"],
//   subject: "Hello from Nodemailer",
//   text: "This is a test email sent using Nodemailer.",
//   html:"<h1>My name is Dhiraj Acharya</h1>"
// };

// sendMail(mailOptions)

connectDB()
  .then(() => {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server is starting at:- http://localhost:${port} `);
    });
  })
  .catch((error) => {
    console.log("Server Connection Error with Database", error);
  });
