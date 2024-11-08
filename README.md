# PostApp

## Project Overview
**PostApp** is a social media application built with the MERN stack (MongoDB, Express, React, Node.js). It provides a modern user interface and a rich text editor, allowing users to create and customize posts with images and theme selections. PostApp implements a complete authentication system with email verification for user sign-up and password reset.

## Features
- **User Authentication & Authorization**: Secure user registration, login, and access control with both **access** and **refresh tokens**.
- **Email Verification & Password Reset**: Verification emails are sent with an OTP for user registration and password recovery using Nodemailer.
- **Rich Text Editor**: Users can create detailed posts with text editor.
- **Image Uploads**: Post images are stored in **Cloudinary**, keeping the server lightweight and efficient.
- **Theme Selection**: Users can choose a theme for each post, making each post unique and visually engaging.

## Technologies Used
- **Frontend**: React, React Router, React Hook Form (for form validation), Tiptap (for the rich text editor)
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens), with **access** and **refresh tokens**
- **Data Validation**: Zod for backend data validation
- **Image Storage**: Cloudinary
- **Email Service**: Nodemailer

## For Testing
- **Step 1**:
    - Run the <a href="https://postapp-backend-7g5a.onrender.com/" target="_blank">Backend</a> (untill you see: "Welcome to post app!!")
    - After that open the <a href="https://postapp-frontend.onrender.com" target="_blank">Frontend</a>
- Then use this account to quickly visit the site :
  - ID: test@test.com
  - PW: check9847
    
## Installation and Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/dheeraaz/PostApp.git
2. Navigate to the project directory:
   ``` bash
   cd PostApp
3. Install Server/Backend dependencies:
   ```bash
   cd Backend
   npm install
4. Install Client/Frontend dependencies:
   ```bash
   cd ../Frontend
   npm install
   
5. Create a `.env` file in the Backend root directory and configure according to `.env.sample`.
   
6. Run the application
- Run the server
   ```bash
   cd ../Backend
   npm run start
- Start the client
  ```bash
  cd ../Frontend
  npm run dev

## Usage
- **Client-side**: Visit http://localhost:5173 to access the application.
- **Registration & Login**: Users must register with a valid email to receive an OTP for verification. After verification, they can log in and access the app's full functionality.
- **Update Profile and Cover Picture**: Users can then navigate to their own profile and update profile picture and cover picture.
- **Creating and Editing Posts**: Users can create posts using rich text editor, upload images (drag and drop enabled), and select a theme for each post.
- **Visit Other's Profile**: Users can visit to the other users' profile to see the posts of specific user only.
