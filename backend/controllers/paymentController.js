import Razorpay from "razorpay";
import Service from "../models/Service.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payments/create-order
export const createOrder = async (req, res) => {
    try {
        const { serviceId } = req.body;
        if (!serviceId) return res.status(400).json({ message: "serviceId is required" });

        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ message: "Service not found" });

        const options = {
            amount: Math.round(Number(service.price) * 100), // paise
            currency: process.env.RAZORPAY_CURRENCY || "INR",
            receipt: `rcpt_${Date.now()}`,
            // optional: notes: { userId: req.user._id.toString(), serviceId }
        };

        const order = await razorpay.orders.create(options);

        return res.status(201).json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID, // front-end needs this
        });
    } catch (err) {
        console.error("createOrder error:", err);
        res.status(500).json({ message: "Failed to create Razorpay order" });
    }
};
