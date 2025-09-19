// backend/routes/rescheduleRoutes.js
import express from "express";
import { rescheduleViaToken } from "../controllers/rescheduleController.js";

const router = express.Router();
router.post("/", rescheduleViaToken);
export default router;
