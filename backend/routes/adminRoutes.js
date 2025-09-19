import express from "express";
import { getAllUsers, getReports, listAllAppointments, assignStaff } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { checkIn, markCompleted, cancelAppointment } from "../controllers/appointmentController.js";

const router = express.Router();

// All routes are protected and only accessible by admin
router.use(protect, authorize("admin"));

router.get("/users", getAllUsers);
router.get("/reports", getReports);

// Appointments
router.get("/appointments", listAllAppointments);
router.put("/appointments/:appointmentId/assign", assignStaff);

// Quick actions (admin can also perform these)
router.put("/appointments/:id/checkin", checkIn);
router.put("/appointments/:id/complete", markCompleted);
router.delete("/appointments/:id", cancelAppointment);

export default router;