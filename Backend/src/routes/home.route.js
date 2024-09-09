import { Router } from "express";
const router = Router();

import { homeRoute } from "../controllers/home.controller.js";


router.route("").get(homeRoute);

export default router;





