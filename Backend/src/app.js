import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

// Routes Import
import homeRouter from "./routes/home.route.js";
import userRouter from "./routes/user.route.js";

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
app.use(morgan("dev"));

// Routes Declaration
app.use("/", homeRouter);
app.use("/api/v1/users", userRouter);

export { app };
