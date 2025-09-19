
// frontend/src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // fetch profile (cookie-based or token-based)
    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    // interceptor already attaches; but ensure axios default too
                    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                } else {
                    delete api.defaults.headers.common["Authorization"];
                }

                const { data } = await api.get("/auth/profile");
                // backend returns { user }
                setUser(data.user || null);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Handle OAuth callback
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const oauthSuccess = urlParams.get('oauth');

        if (oauthSuccess === 'success') {
            // OAuth login successful, fetch user profile with retry logic
            const handleOAuthSuccess = async () => {
                let retries = 3;
                let success = false;

                while (retries > 0 && !success) {
                    try {
                        console.log(`Attempting to fetch user profile after OAuth... (${4 - retries}/3)`);

                        // Wait a bit for cookie to be set
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        const { data } = await api.get("/auth/profile");
                        console.log("Profile data received:", data);
                        setUser(data.user || null);
                        toast.success("Successfully logged in with Google!");
                        success = true;

                        // Clean up URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } catch (err) {
                        console.error(`Attempt ${4 - retries} failed:`, err);
                        console.error("Error status:", err.response?.status);
                        console.error("Error details:", err.response?.data);
                        console.error("Request URL:", err.config?.url);

                        retries--;

                        if (retries === 0) {
                            console.error("All retry attempts failed");
                            console.log("Attempting to refresh the page to retry OAuth...");
                            toast.error("Failed to complete Google login. Refreshing page...");
                            // Try refreshing the page as a last resort
                            window.location.reload();
                        } else {
                            console.log(`Retrying in 2 seconds... (${retries} attempts left)`);
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                    }
                }
            };

            handleOAuthSuccess();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
