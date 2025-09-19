// backend/services/notify.js
import nodemailer from "nodemailer";
import twilio from "twilio";

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const twilioClient = process.env.TWILIO_SID && process.env.TWILIO_AUTH ? twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH) : null;

export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text, html });
    } catch (err) {
        console.error("sendEmail error:", err.message);
    }
};

export const sendSMS = async ({ to, body }) => {
    try {
        if (!twilioClient || !process.env.TWILIO_PHONE) return;
        await twilioClient.messages.create({ body, from: process.env.TWILIO_PHONE, to });
    } catch (err) {
        console.error("sendSMS error:", err.message);
    }
};
