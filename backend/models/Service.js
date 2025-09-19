// backend/models/service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // Keep for backward compatibility
        title: { type: String, required: true }, // New primary field
        description: { type: String },
        price: { type: Number, required: true },
        duration: { type: Number, required: true }, // in minutes
        staffRequired: { type: Boolean, default: false },
        category: { type: String, required: true },
        image: { type: String }, // Service image URL
        icon: { type: String }, // Icon class name (e.g., "ri-scissors-line")
    },
    { timestamps: true }
);


const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);
export default Service;
