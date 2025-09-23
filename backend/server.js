// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import setupPassport from "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import rescheduleRoutes from "./routes/rescheduleRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
// import reportRoutes from "./routes/reportRoutes.js";   // uncomment when ready
import paymentRoutes from "./routes/paymentRoutes.js"; // uncomment when ready

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import {
    startReminderCron,
    startMissedCron,
    startWeeklyReportCron,
} from "./services/scheduler.js";

// env + db
dotenv.config({ path: "../.env" });
connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL || "https://salon-frontend-2ih2.onrender.com",
        credentials: true,
    })
);
app.use(morgan("dev"));

// session + passport for OAuth
app.use(
    session({
        secret: process.env.SESSION_SECRET || "sessionsecret",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src * 'self' data: blob:; font-src * 'self' data:;"
    );
    next();
});

app.use(passport.initialize());
app.use(passport.session());
setupPassport();

// serve uploaded files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/oauth", oauthRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reschedule", rescheduleRoutes);
app.use("/api/analytics", analyticsRoutes);

// if (reportRoutes) app.use("/api/reports", reportRoutes);
app.use("/api/payments", paymentRoutes);

// cron jobs
startReminderCron();
startMissedCron();
startWeeklyReportCron();

// Root route (health check)
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);




// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);

