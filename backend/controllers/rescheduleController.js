import Appointment from "../models/Appointment.js";
import jwt from "jsonwebtoken";
import Service from "../models/Service.js";

export const createRescheduleToken = (appointment) => {
    return jwt.sign({ appointmentId: appointment._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const rescheduleViaToken = async (req, res) => {
    try {
        const { token, newDate } = req.body;
        if (!token) return res.status(400).json({ message: "Missing token" });
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const appointment = await Appointment.findById(payload.appointmentId);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        // set new date, mark confirmed
        appointment.date = new Date(newDate);
        appointment.status = "confirmed";
        await appointment.save();
        res.json({ success: true, appointment });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
