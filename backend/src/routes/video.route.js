import express from "express";
import { getStreamToken } from "../controllers/video.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);

export default router;
