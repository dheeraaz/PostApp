import multer from "multer";

import crypto from "crypto";
import path from "path";
import fs from 'fs'


// __dirname is not defined in ES Module Scope, so this small tweak is needed to replicate the __dirname functionality as of commonjs
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// defining upload directory
const uploadDir = path.join(__dirname, "../../public/temp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // if directory is not already present, simply create one
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // if directory is present, then upload the file
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, ranBytes) {
      const uniqueFileName =
        ranBytes.toString("hex") + path.extname(file.originalname);
      cb(null, uniqueFileName);
    });
  },
});


// applying file filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase(); //returns .jpg / .jpeg
  const allowedFileType = [".jpg", ".png", ".jpeg", ".gif"];

  if (allowedFileType.includes(ext)) {
    cb(null, true)
  }else{
    cb(new Error('Only images are allowed'))
  }
}

export const multerUpload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, //maximum size of individual image 2 MB
  fileFilter: fileFilter
});
