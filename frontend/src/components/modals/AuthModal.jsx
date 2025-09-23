import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import OAuthButtons from "../common/OAuthButtons";
import toast from "react-hot-toast";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState(initialMode);
    const [loading, setLoading] = useState(false);

    // Login form state
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });

    // Register form state
    const [registerForm, setRegisterForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    // Reset forms when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setLoginForm({ email: "", password: "" });
            setRegisterForm({ name: "", email: "", phone: "", password: "" });
        }
    }, [isOpen, initialMode]);

    // Login handler
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post("/auth/login", loginForm);
            const token = data.token;
            const user = data.user;

            if (token) {
                localStorage.setItem("token", token);
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            }

            setUser(user);
            toast.success("Login successful!");
            onClose();

            // Redirect based on role
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    // Register handler
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/auth/register", registerForm);
            toast.success("Registration successful! Please login.");
            setMode("login");
            // Pre-fill email in login form
            setLoginForm({ ...loginForm, email: registerForm.email });
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        // Clear forms when switching
        setLoginForm({ email: "", password: "" });
        setRegisterForm({ name: "", email: "", phone: "", password: "" });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => switchMode("login")}
                                        className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === "login"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 hover:text-gray-800"
                                            }`}
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => switchMode("register")}
                                        className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === "register"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 hover:text-gray-800"
                                            }`}
                                    >
                                        Register
                                    </button>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Form Content with Animation */}
                            <AnimatePresence mode="wait">
                                {mode === "login" ? (
                                    <motion.div
                                        key="login"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <form onSubmit={handleLogin} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={loginForm.email}
                                                    onChange={(e) =>
                                                        setLoginForm({ ...loginForm, email: e.target.value })
                                                    }
                                                    placeholder="Enter your email"
                                                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={loginForm.password}
                                                    onChange={(e) =>
                                                        setLoginForm({ ...loginForm, password: e.target.value })
                                                    }
                                                    placeholder="Enter your password"
                                                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? "Signing in..." : "Sign In"}
                                            </button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="register"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <form onSubmit={handleRegister} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={registerForm.name}
                                                    onChange={(e) =>
                                                        setRegisterForm({ ...registerForm, name: e.target.value })
                                                    }
                                                    placeholder="Enter your full name"
                                                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={registerForm.email}
                                                    onChange={(e) =>
                                                        setRegisterForm({ ...registerForm, email: e.target.value })
                                                    }
                                                    placeholder="Enter your email"
                                                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={registerForm.phone}
                                                    onChange={(e) =>
                                                        setRegisterForm({ ...registerForm, phone: e.target.value })
                                                    }
                                                    placeholder="Enter your phone number"
                                                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={registerForm.password}
                                                    onChange={(e) =>
                                                        setRegisterForm({ ...registerForm, password: e.target.value })
                                                    }
                                                    placeholder="Create a password"
                                                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? "Creating Account..." : "Create Account"}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* OAuth Section */}
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <OAuthButtons />
                                </div>
                            </div>

                            {/* Mode Switch Helper Text */}
                            <div className="mt-4 text-center text-sm text-gray-600">
                                {mode === "login" ? (
                                    <>
                                        Don't have an account?{" "}
                                        <button
                                            onClick={() => switchMode("register")}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Sign up here
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{" "}
                                        <button
                                            onClick={() => switchMode("login")}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Sign in here
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
