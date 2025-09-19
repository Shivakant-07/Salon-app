import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        role: {
            type: String,
            enum: ["customer", "staff", "admin"],
            default: "customer",
        },
        phone: { type: String },
        googleId: { type: String },

        // profile photo
        avatarUrl: { type: String, default: "" },

        // STAFF FIELDS
        skills: [{ type: String }],
        exp: { type: String },
        position: { type: String },
        availableToday: { type: Boolean, default: false },
    },
    { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const User = mongoose.model("User", userSchema);
export default User;