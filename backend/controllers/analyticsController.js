// backend/controllers/analyticsController.js
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

import mongoose from 'mongoose';

export const revenueRange = async (req, res) => {
    try {
        const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const to = req.query.to ? new Date(req.query.to) : new Date();
        const agg = await Appointment.aggregate([
            { $match: { paymentStatus: "paid", date: { $gte: from, $lte: to } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, revenue: { $sum: "$price" }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        res.json(agg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const popularServices = async (req, res) => {
    try {
        const agg = await Appointment.aggregate([
            { $group: { _id: "$service", count: { $sum: 1 }, revenue: { $sum: "$price" } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        const svcIds = agg.map(a => a._id);
        const services = await Service.find({ _id: { $in: svcIds } });
        const mapped = agg.map(a => ({
            serviceId: a._id,
            name: services.find(s => s._id.toString() === a._id.toString())?.name || "Unknown",
            count: a.count,
            revenue: a.revenue
        }));
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const staffPerformance = async (req, res) => {
    try {
        const agg = await Appointment.aggregate([
            { $group: { _id: "$staff", bookings: { $sum: 1 }, revenue: { $sum: "$price" } } },
            { $sort: { bookings: -1 } }
        ]);
        const staffIds = agg.map(a => a._id).filter(Boolean);
        const users = await User.find({ _id: { $in: staffIds } });
        const mapped = agg.map(a => ({
            staffId: a._id,
            name: users.find(u => u._id.toString() === (a._id || "").toString())?.name || "Unknown",
            bookings: a.bookings,
            revenue: a.revenue
        }));
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
