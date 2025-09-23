import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch profile on mount (cookie-based)
    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/auth/profile"); // sends cookie automatically
                setUser(data.user || null);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Handle OAuth redirect
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const oauthSuccess = urlParams.get('oauth');

        if (oauthSuccess === 'success') {
            (async () => {
                try {
                    const { data } = await api.get("/auth/profile");
                    setUser(data.user || null);
                    toast.success("Successfully logged in with Google!");
                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                } catch {
                    toast.error("Failed to complete Google login. Refresh page and try again.");
                    setUser(null);
                }
            })();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
