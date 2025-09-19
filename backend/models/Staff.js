import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },           // Staff name
    email: { type: String, default: "" },             // Optional email
    skills: [{ type: String }],                       // List of skills
    availableToday: { type: Boolean, default: false },
});

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
