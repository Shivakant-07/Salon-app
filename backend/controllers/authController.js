// backend/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

// Generate token (returns string)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register
const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password, phone });

        if (user) {
            const token = generateToken(user._id);

            // optional: still set cookie for clients that use cookies (kept but frontend will use header)
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            });

            // send user (without password) and token in body
            const { password: _p, ...userObj } = user.toObject();
            return res.status(201).json({ user: userObj, token });
        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Login (modified to return token + user)
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);

            // optional: set cookie as well
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            });

            const { password: _p, ...userObj } = user.toObject();
            return res.json({ user: userObj, token });
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),   // expire immediately
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    });

    res.status(200).json({ message: "Logged out successfully" });
};

// Profile - return as { user } so frontend can do data.user
const getProfile = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    res.status(200).json({ user: req.user });
};

// Update profile — unchanged except it returns user as { user }
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;

        // set avatar from uploaded file
        if (req.file) {
            const base = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
            user.avatarUrl = `${base}/api/uploads/avatars/${req.file.filename}`;
        }

        if (req.body.newPassword) {
            user.password = req.body.newPassword;
        }

        const updated = await user.save();
        const { password, ...rest } = updated.toObject();
        res.json({ user: rest });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export { registerUser, loginUser, logoutUser, getProfile, updateProfile };