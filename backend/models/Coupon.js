import mongoose from "mongoose";

const couponSchema = mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        discount: { type: Number, required: true },
        expiry: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
