// backend/controllers/adminController.js
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

export const listAllAppointments = async (req, res) => {
    try {
        const apps = await Appointment.find().populate("customer service staff").sort({ date: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const assignStaff = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { staffId } = req.body;
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        const staffUser = await User.findById(staffId);
        if (!staffUser) return res.status(404).json({ message: "Staff user not found" });

        // check staff availability overlap (reusing earlier logic, simplified)
        const service = await Service.findById(appointment.service);
        const start = new Date(appointment.date);
        const duration = service?.duration || 30;
        const end = new Date(start.getTime() + duration * 60 * 1000);

        const overlapping = await Appointment.find({
            staff: staffId,
            _id: { $ne: appointment._id },
            status: { $nin: ["cancelled", "completed", "missed"] },
            date: { $gte: new Date(start.getTime() - duration * 60 * 1000), $lte: end }
        });

        if (overlapping.length) return res.status(400).json({ message: "Staff not available for that time" });

        appointment.staff = staffId;
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReports = async (req, res) => {
    try {
        const totalAppointments = await Appointment.countDocuments();
        const completed = await Appointment.countDocuments({ status: "completed" });
        const cancelled = await Appointment.countDocuments({ status: "cancelled" });

        res.json({ totalAppointments, completed, cancelled });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getAllUsers, getReports };
