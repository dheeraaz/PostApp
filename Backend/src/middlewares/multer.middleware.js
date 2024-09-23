import multer from "multer";

import crypto from "crypto";
import path from "path";

// __dirname is not defined in ES Module Scope, so this small tweak is needed to replicate the __dirname functionality as of commonjs
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/temp"));
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, ranBytes) {
      const uniqueFileName =
        ranBytes.toString("hex") + path.extname(file.originalname);
      cb(null, uniqueFileName);
    });
  },
});

export const multerUpload = multer({ storage: storage });
