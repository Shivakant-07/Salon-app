import express from "express";
import { revenueRange, popularServices, staffPerformance } from "../controllers/analyticsController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes and allow only admin
router.use(protect, authorize("admin"));

router.get("/revenue", revenueRange);
router.get("/popular-services", popularServices);
router.get("/staff-performance", staffPerformance);

export default router;
