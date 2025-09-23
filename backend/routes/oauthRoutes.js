// backend/routes/oauthRoutes.js
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login`, session: false }),
    (req, res) => {
        try {
            console.log("OAuth callback received for user:", req.user?.email);

            // issue JWT and set cookie, then redirect to client
            const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

            const clientUrl = process.env.CLIENT_URL || "https://salon-frontend-2ih2.onrender.com";
            console.log("Redirecting to:", `${clientUrl}/?oauth=success`);

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            res.redirect(`${clientUrl}/?oauth=success`);
        } catch (error) {
            console.error("Error in OAuth callback:", error);
            res.redirect(`${process.env.CLIENT_URL || "https://salon-frontend-2ih2.onrender.com"}/login?error=oauth_failed`);
        }
    }
);

export default router;