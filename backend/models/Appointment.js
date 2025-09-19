import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        staff: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
        date: { type: Date, required: true },
        status: {
            type: String,
            enum: ["pending", "confirmed", "checked-in", "completed", "cancelled", "missed"],
            default: "confirmed",
        },
        price: { type: Number, required: true },

        // attendance
        checkIn: { type: Boolean, default: false },

        // payments
        paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
        paymentProvider: { type: String, enum: [null, "stripe", "razorpay"], default: null },
        paymentId: { type: String, default: null },        // Razorpay payment id OR Stripe intent id if you reuse it
        paymentOrderId: { type: String, default: null },   // Razorpay order id
    },
    { timestamps: true }
);

// Indexes to speed up availability and listings
appointmentSchema.index({ date: 1, staff: 1, status: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;