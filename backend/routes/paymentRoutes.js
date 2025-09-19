import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createOrder } from "../controllers/paymentController.js";

const router = express.Router();

// Creates a Razorpay order based on service price (allowed for customer/staff/admin flows)
router.post("/create-order", protect, authorize("customer", "staff", "admin"), createOrder);

export default router;