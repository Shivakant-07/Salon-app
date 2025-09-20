import React from "react";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OAuthButtons() {
    const { setUser } = useAuth();
    const nav = useNavigate();

    // --- Google OAuth login ---
    const googleAuth = () => {
        // Open backend OAuth route
        window.open(
            `${import.meta.env.VITE_API_URL || "https://salon-backend-ktdp.onrender.com/api"}/oauth/google`,
            "_self"
        );
    };

    return (
        <div className="flex gap-2 justify-center">
            <button
                onClick={googleAuth}
                className="px-4 py-2 border rounded bg-red-500 text-white hover:bg-red-600 transition"
            >
                Sign in with Google
            </button>
        </div>
    );
}