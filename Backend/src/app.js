import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import logger from "./utils/logger.js";
import morgan from "morgan";

// Routes Import
import homeRouter from "./routes/home.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true, //for allowing backend to set and read cookie
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));

app.use(express.static("public"));
app.use(cookieParser());

// used for logging the http requests concisely
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Routes Declaration
app.use("/", homeRouter);
app.use("/api/v1/auth", authRouter);

export { app };
