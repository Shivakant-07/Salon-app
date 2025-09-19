import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";

// ------------------ Availability Slots ------------------
export const getAvailableSlots = async (req, res) => {
    try {
        const { serviceId, date, staffId } = req.query;
        if (!serviceId || !date) {
            return res.status(400).json({ message: "serviceId and date are required" });
        }

        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ message: "Service not found" });

        // Build day range in local time
        const day = new Date(date + "T00:00:00");
        const startOfDay = new Date(day);
        const endOfDay = new Date(day);
        endOfDay.setHours(23, 59, 59, 999);

        // Business hours (inclusive start, exclusive end)
        const businessStartHour = Number(process.env.BUSINESS_START_HOUR || 9); // 09:00
        const businessEndHour = Number(process.env.BUSINESS_END_HOUR || 18);   // 18:00
        const duration = service.duration; // minutes

        // Fetch existing appointments that could overlap that day (optionally for staff)
        const apptQuery = {
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $nin: ["cancelled", "missed"] },
        };
        if (staffId) apptQuery.staff = staffId;
        const sameDayAppointments = await Appointment.find(apptQuery).select("date service");

        // Helper to check overlap for a candidate slot vs existing appts (same staff only if staffId provided)
        const overlaps = (slotStart) => {
            const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);
            for (const a of sameDayAppointments) {
                // Resolve each appointment's service duration
                // If price/duration is denormalized in Appointment, prefer that; else look up service durations
                // Here we fetch by service duration assumption
                const apptStart = new Date(a.date);
                const apptServiceDuration = service.duration; // best-effort; exact service lookup would add extra queries
                const apptEnd = new Date(apptStart.getTime() + apptServiceDuration * 60 * 1000);
                if (slotStart < apptEnd && apptStart < slotEnd) return true;
            }
            return false;
        };

        // Generate slots at service duration intervals
        const slots = [];
        const firstSlot = new Date(day);
        firstSlot.setHours(businessStartHour, 0, 0, 0);
        const closeTime = new Date(day);
        closeTime.setHours(businessEndHour, 0, 0, 0);

        for (let t = new Date(firstSlot); t < closeTime; t = new Date(t.getTime() + duration * 60 * 1000)) {
            // ensure the entire service fits before closing
            if (new Date(t.getTime() + duration * 60 * 1000) > closeTime) break;
            if (!overlaps(t)) {
                const hh = String(t.getHours()).padStart(2, "0");
                const mm = String(t.getMinutes()).padStart(2, "0");
                slots.push(`${hh}:${mm}`);
            }
        }

        return res.json({ slots });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Helper: check overlap
const hasOverlap = async ({ personField, personId, date, durationMinutes, excludeAppointmentId = null }) => {
    const start = new Date(date);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    const rangeStart = new Date(start.getTime() - durationMinutes * 60 * 1000);
    const rangeEnd = new Date(end.getTime());

    const candidates = await Appointment.find({
        [personField]: personId,
        _id: { $ne: excludeAppointmentId },
        status: { $nin: ["cancelled", "completed", "missed"] },
        date: { $gte: rangeStart, $lte: rangeEnd }
    });

    for (const c of candidates) {
        const cStart = new Date(c.date);
        const diff = Math.abs(cStart.getTime() - start.getTime());
        if (diff < durationMinutes * 60 * 1000) return true;
    }
    return false;
};

// ------------------ Customer ------------------

// Book appointment
export const bookAppointment = async (req, res) => {
    try {
        const { service: serviceId, date: dateStr, staff: staffId, paymentStatus, paymentIntentId } = req.body;
        const service = await Service.findById(serviceId);
        if (!service) return res.status(400).json({ message: "Service not found" });

        const date = new Date(dateStr);

        // Overlap checks
        const customerOverlap = await hasOverlap({
            personField: "customer",
            personId: req.user._id,
            date,
            durationMinutes: service.duration
        });
        if (customerOverlap) return res.status(400).json({ message: "You already have an overlapping appointment." });

        if (staffId) {
            const staffOverlap = await hasOverlap({
                personField: "staff",
                personId: staffId,
                date,
                durationMinutes: service.duration
            });
            if (staffOverlap) return res.status(400).json({ message: "Selected staff is not available at this time." });
        }

        const appointment = await Appointment.create({
            customer: req.user._id,
            staff: staffId || null,
            service: serviceId,
            date,
            status: "confirmed",
            paymentStatus: paymentStatus || "unpaid",
            paymentIntentId: paymentIntentId || null,
            price: service.price
        });

        return res.status(201).json(appointment);
    } catch (err) {
        console.error("bookAppointment error:", err.message);
        return res.status(500).json({ message: err.message });
    }
};

// Get appointments for logged-in customer
export const getMyBooking = async (req, res) => {
    try {
        const appointments = await Appointment.find({ customer: req.user._id })
            .populate("service")
            .populate("staff");
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Reschedule appointment
export const rescheduleAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Not found" });
        appointment.date = req.body.date || appointment.date;
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Not found" });
        appointment.status = "cancelled";
        await appointment.save();
        res.json({ message: "Appointment cancelled" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ------------------ Staff ------------------

export const staffAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ staff: req.user._id })
            .populate("customer service");
        res.json(appointments);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

export const markCompleted = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Not found" });
        appointment.status = "completed";
        await appointment.save();
        res.json(appointment);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

export const checkIn = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Not found" });
        appointment.status = "checked-in";
        appointment.checkIn = true;
        await appointment.save();
        res.json(appointment);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// ------------------ Admin ------------------

export const adminAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("customer staff service");
        res.json(appointments);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// ------------------ General for logged-in user ------------------
export const getAppointments = async (req, res) => {
    try {
        let appointments;

        if (req.user.role === "customer") {
            appointments = await Appointment.find({ customer: req.user._id })
                .populate("service")
                .populate("staff");
        } else if (req.user.role === "staff") {
            appointments = await Appointment.find({ staff: req.user._id })
                .populate("service")
                .populate("customer");
        } else if (req.user.role === "admin") {
            appointments = await Appointment.find()
                .populate("service")
                .populate("customer")
                .populate("staff");
        } else {
            return res.status(403).json({ message: "Invalid role" });
        }

        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Staff/Admin: Book for SELF (customer = current user even if role is staff/admin)
export const bookAppointmentSelf = async (req, res) => {
    try {
        const { service: serviceId, date: dateStr, staff: staffId, paymentStatus, paymentProvider, paymentId, paymentOrderId } = req.body;
        const service = await Service.findById(serviceId);
        if (!service) return res.status(400).json({ message: "Service not found" });

        const date = new Date(dateStr);

        // overlap checks
        const customerOverlap = await hasOverlap({ personField: "customer", personId: req.user._id, date, durationMinutes: service.duration });
        if (customerOverlap) return res.status(400).json({ message: "You already have an overlapping appointment." });

        if (staffId) {
            const staffOverlap = await hasOverlap({ personField: "staff", personId: staffId, date, durationMinutes: service.duration });
            if (staffOverlap) return res.status(400).json({ message: "Selected staff is not available at this time." });
        }

        const appointment = await Appointment.create({
            customer: req.user._id,
            staff: staffId || null,
            service: serviceId,
            date,
            status: "confirmed",
            paymentStatus: paymentStatus || "unpaid",
            paymentProvider: paymentProvider || null,
            paymentId: paymentId || null,
            paymentOrderId: paymentOrderId || null,
            price: service.price
        });

        return res.status(201).json(appointment);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Staff/Admin: Book FOR a CUSTOMER (existing by email/phone, or create minimal account)
export const bookAppointmentForCustomer = async (req, res) => {
    try {
        const { customer, service: serviceId, date: dateStr, staff: staffId, paymentStatus, paymentProvider, paymentId, paymentOrderId } = req.body;
        // customer: { name, email, phone, id? }
        if (!customer) return res.status(400).json({ message: "Customer info required" });

        const service = await Service.findById(serviceId);
        if (!service) return res.status(400).json({ message: "Service not found" });

        let customerId = customer.id || null;
        if (!customerId) {
            const User = (await import("../models/User.js")).default;
            let found = null;
            if (customer.email) found = await User.findOne({ email: customer.email });
            if (!found && customer.phone) found = await User.findOne({ phone: customer.phone });
            if (!found) {
                found = await User.create({
                    name: customer.name || "Customer",
                    email: customer.email || `${Date.now()}@example.com`,
                    phone: customer.phone || "",
                    role: "customer",
                    password: Math.random().toString(36).slice(2, 10) // temporary; they can reset later
                });
            } else {
                // update basic fields if provided
                if (customer.name) found.name = customer.name;
                if (customer.phone) found.phone = customer.phone;
                await found.save();
            }
            customerId = found._id;
        }

        const date = new Date(dateStr);

        // overlap checks
        const customerOverlap = await hasOverlap({ personField: "customer", personId: customerId, date, durationMinutes: service.duration });
        if (customerOverlap) return res.status(400).json({ message: "Customer has an overlapping appointment." });

        if (staffId) {
            const staffOverlap = await hasOverlap({ personField: "staff", personId: staffId, date, durationMinutes: service.duration });
            if (staffOverlap) return res.status(400).json({ message: "Selected staff is not available at this time." });
        }

        const appointment = await Appointment.create({
            customer: customerId,
            staff: staffId || null,
            service: serviceId,
            date,
            status: "confirmed",
            paymentStatus: paymentStatus || "unpaid",
            paymentProvider: paymentProvider || null,
            paymentId: paymentId || null,
            paymentOrderId: paymentOrderId || null,
            price: service.price
        });

        return res.status(201).json(appointment);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};