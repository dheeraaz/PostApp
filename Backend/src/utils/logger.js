import { createLogger, format, transports } from "winston";

import path from "path";

// __dirname is not defined in ES Module Scope, so this small tweak is needed to replicate the __dirname functionality as of commonjs
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const { combine, timestamp, json, colorize, printf } = format;

// Custom format for console logging with colors
const consoleLogFormat = printf(({ level, message }) => {
  return `${level}: ${message}`;
});

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({ filename: path.join(__dirname, "../app.log") }),
  ],
});

export default logger;
