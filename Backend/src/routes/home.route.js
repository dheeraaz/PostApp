import { Router } from "express";

//importing middleware and controllers
import { homeRoute } from "../controllers/home.controller.js";

const router = Router();

// declaring route
router.route("").get(homeRoute);

export default router;
