// backend/config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

export default function setupPassport() {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.SERVER_URL}/api/oauth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const existing = await User.findOne({ googleId: profile.id });
                    if (existing) return done(null, existing);
                    // If user with same email exists, link googleId
                    const email = profile.emails?.[0]?.value;
                    let user = null;
                    if (email) user = await User.findOne({ email });
                    if (user) {
                        user.googleId = profile.id;
                        await user.save();
                        return done(null, user);
                    }
                    const created = await User.create({
                        name: profile.displayName,
                        email,
                        googleId: profile.id,
                        role: "customer",
                    });
                    return done(null, created);
                } catch (err) {
                    return done(err, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
}