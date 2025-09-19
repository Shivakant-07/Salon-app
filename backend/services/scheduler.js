// backend/services/scheduler.js
import cron from "node-cron";
import Appointment from "../models/Appointment.js";
import { sendEmail, sendSMS } from "./notify.js";


// Helper to run when service triggers
const notifyReminder = async (appointment, hoursLeft) => {
    await appointment.populate("customer service staff");
    const { customer, service, staff } = appointment;
    const subject = `Reminder: ${service.name} in ${hoursLeft} hour(s)`;
    const text = `Hi ${customer.name}, this is a reminder for your ${service.name} appointment scheduled on ${new Date(appointment.date).toLocaleString()}.`;
    if (customer.email) await sendEmail({ to: customer.email, subject, text });
    if (customer.phone) await sendSMS({ to: customer.phone, body: text });
};

export const startReminderCron = () => {
    // every 10 minutes check for 24h and 1h reminders (5-min window)
    cron.schedule("*/10 * * * *", async () => {
        try {
            const now = new Date();
            const windows = [
                { hours: 24, start: new Date(now.getTime() + 24 * 60 * 60 * 1000), end: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 5 * 60 * 1000) },
                { hours: 1, start: new Date(now.getTime() + 1 * 60 * 60 * 1000), end: new Date(now.getTime() + 1 * 60 * 60 * 1000 + 5 * 60 * 1000) },
            ];

            for (const w of windows) {
                const apps = await Appointment.find({ date: { $gte: w.start, $lt: w.end }, status: "confirmed" }).populate("customer service staff");
                for (const a of apps) await notifyReminder(a, w.hours);
            }
        } catch (err) {
            console.error("Reminder cron error:", err.message);
        }
    });
};

export const startMissedCron = () => {
    // run every 15 minutes to detect missed appointments >10 minutes past
    cron.schedule("*/15 * * * *", async () => {
        try {
            const now = new Date();
            const missed = await Appointment.find({
                date: { $lte: new Date(now.getTime() - 10 * 60 * 1000) },
                status: { $nin: ["completed", "cancelled", "missed"] },
                checkIn: false
            }).populate("customer service staff");

            for (const a of missed) {
                a.status = "missed";
                await a.save();
                const link = `${process.env.CLIENT_URL}/reschedule/${a._id}`;
                const text = `Hi ${a.customer.name}, we missed you for your ${a.service.name} appointment on ${new Date(a.date).toLocaleString()}. Reschedule here: ${link}`;
                if (a.customer.email) await sendEmail({ to: a.customer.email, subject: "We missed you", text });
                if (a.customer.phone) await sendSMS({ to: a.customer.phone, body: text });
            }
        } catch (err) {
            console.error("Missed cron error:", err.message);
        }
    });
};

export const startWeeklyReportCron = () => {
    // every Monday at 09:00
    cron.schedule("0 9 * * MON", async () => {
        try {
            const apps = await Appointment.find().populate("customer service staff");
            const total = apps.length;
            const paid = apps.filter(a => a.paymentStatus === 'paid').length;
            const text = `Weekly report: total appointments: ${total}, paid: ${paid}`;
            if (process.env.ADMIN_EMAIL) await sendEmail({ to: process.env.ADMIN_EMAIL, subject: "Weekly Salon Report", text });
        } catch (err) {
            console.error("Weekly report cron error:", err.message);
        }
    });
};