import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
    bookAppointment,
    getAppointments,          // <-- add this
    getMyBooking,
    rescheduleAppointment,
    cancelAppointment,
    staffAppointments,
    markCompleted,
    checkIn,
    adminAppointments,
    getAvailableSlots,
    bookAppointmentSelf,
    bookAppointmentForCustomer
} from "../controllers/appointmentController.js";

const router = express.Router();

// General appointments
router.route("/")
    .get(protect, getAppointments)
    .post(protect, bookAppointment);

// Appointment by ID
// Note: Delete is restricted below to customers only

// Customer routes
router.post("/book", protect, authorize("customer"), bookAppointment);
router.put("/reschedule/:id", protect, authorize("customer"), rescheduleAppointment);

// Staff routes
router.get("/staff", protect, authorize("staff"), staffAppointments);
router.put("/checkin/:id", protect, authorize("staff"), checkIn);

// Complete
router.put("/complete/:id", protect, authorize("staff", "admin"), markCompleted);

// Cancel
router.delete("/:id", protect, authorize("customer", "admin", "staff"), cancelAppointment);

// Admin routes
router.get("/all", protect, authorize("admin"), adminAppointments);

// Staff/Admin booking flows
router.post("/book-self", protect, authorize("staff", "admin"), bookAppointmentSelf);
router.post("/book-for", protect, authorize("staff", "admin"), bookAppointmentForCustomer);

// Slots
router.get("/available-slots", getAvailableSlots);

//get appointment
router.get("/my", protect, getMyBooking);

export default router;