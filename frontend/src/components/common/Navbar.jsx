// frontend/src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axiosInstance";
import BookingModal from "../modals/BookingModal";
import ProfileModal from "../modals/ProfileModal";
import AdminDashboardModal from "../modals/AdminDashboardModal";
import ManageStaffModal from "../modals/ManageStaffModal";
import ManageServicesModal from "../modals/ManageServicesModal";
import AuthModal from "../modals/AuthModal";
import StaffDashboardModal from "../../pages/staff/StaffDashboardModal";
import MyAppointmentsModal from "../modals/MyAppointmentsModal";

export default function Navbar() {
    const { user, setUser } = useAuth();
    const nav = useNavigate();
    const [open, setOpen] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showAdminDashboard, setShowAdminDashboard] = useState(false);
    const [showManageStaff, setShowManageStaff] = useState(false);
    const [showManageServices, setShowManageServices] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const [showStaffDashboard, setShowStaffDashboard] = useState(false);
    const [showMyAppointments, setShowMyAppointments] = useState(false);

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.removeItem("token");
            delete api.defaults.headers.common["Authorization"];
            setUser(null);
            toast.success("Successfully logout!");
            nav("/");
        }
    };

    return (
        <>
            <header className="sticky top-0 z-40 bg-bg-card ">
                <nav className="mx-auto max-w-8xl px-20 sm:px-6 lg:px-8 py-3 text-white">
                    <div className="flex items-center justify-end gap-5">
                        {user ? (
                            <div className="text-sm text-text-muted text-center">Hi, {user.name} ({user.role})</div>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setAuthMode("login"); setShowAuth(true); }}
                                    className="w-full flex-1 px-3 py-2 rounded-md bg-danger text-white hover:bg-red-600 transition"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => { setAuthMode("register"); setShowAuth(true); }}
                                    className="w-full flex-1 px-3 py-2 text-center rounded-md border border-white hover:bg-white hover:text-gray-900 text-white transition"
                                >
                                    Register
                                </button>
                            </div>
                        )}
                        {/* Mobile menu button */}
                        {user && (
                            <>
                                <button
                                    className="inline-flex items-center justify-center rounded-md p-2 hover:bg-black/5"
                                    onClick={() => setOpen(!open)}
                                    aria-label="Toggle menu"
                                >
                                    <svg width="22" height="22" viewBox="0 0 24 24" className="fill-current"><path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" /></svg>
                                </button>
                            </>
                        )}
                    </div>
                    {/* Mobile drawer */}
                    <AnimatePresence>
                        {open && (
                            <div className="fixed inset-0 z-50">
                                {/* Background overlay with blur */}
                                <motion.div
                                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setOpen(false)}
                                />

                                {/* Drawer sliding from right */}
                                <motion.div
                                    className="absolute right-[0%] top-0 h-full w-96 max-w-[80%] bg-bg-card p-4 space-y-2"
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >


                                    <div className="flex text-sm px-4 text-text-muted justify-between ">
                                        <span className=" pt-1">Hi, {user.name} ({user.role})</span>
                                        {open && (
                                            <button
                                                className="right-0 rounded-md hover:bg-black/5"
                                                onClick={() => setOpen(false)}
                                            >
                                                <i className="ri-close-line text-3xl"></i>
                                            </button>

                                        )}
                                    </div>
                                    <div className="pt-5 mt-5">
                                        {!user ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setOpen(false); setAuthMode("login"); setShowAuth(true); }}
                                                    className="w-full flex-1 px-3 py-2 rounded-md bg-danger text-white hover:bg-red-600 transition"
                                                >
                                                    Login
                                                </button>
                                                <button
                                                    onClick={() => { setOpen(false); setAuthMode("register"); setShowAuth(true); }}
                                                    className="w-full flex-1 px-3 py-2 text-center rounded-md border border-white hover:bg-white hover:text-gray-900 text-white transition"
                                                >
                                                    Register
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">

                                                <button
                                                    onClick={() => { setOpen(false); setShowProfile(true); }}
                                                    className="w-full px-3 py-2 text-center rounded-md border border-white hover:bg-white hover:text-gray-900 text-white transition"
                                                >
                                                    Profile
                                                </button>
                                                <button
                                                    onClick={() => { setOpen(false); setShowMyAppointments(true); }}
                                                    className="w-full px-3 py-2 text-center rounded-md border border-white hover:bg-white hover:text-gray-900 text-white transition"
                                                >
                                                    My Appointments
                                                </button>

                                                {user.role === "staff" && (
                                                    <button
                                                        onClick={() => { setOpen(false); setShowStaffDashboard(true); }}
                                                        className="w-full px-3 py-2 text-center rounded-md border border-white hover:bg-white hover:text-gray-900 text-white transition"
                                                    >
                                                        Dashboard
                                                    </button>
                                                )}

                                                {user.role === "admin" && (
                                                    <>
                                                        <button
                                                            onClick={() => { setOpen(false); setShowAdminDashboard(true); }}
                                                            className="w-full px-3 py-2 text-center rounded-md border border-white hover:bg-white hover:text-gray-900 text-white transition"
                                                        >
                                                            Dashboard
                                                        </button>
                                                        <button
                                                            onClick={() => { setOpen(false); setShowManageServices(true); }}
                                                            className="w-full px-3 py-2 text-center rounded-md border border-white hover:bg-white hover:text-gray-900 text-white transition"
                                                        >
                                                            Manage Services
                                                        </button>
                                                        <button
                                                            onClick={() => { setOpen(false); setShowManageStaff(true); }}
                                                            className="w-full px-3 py-2 text-center rounded-md border border-white hover:bg-white hover:text-gray-900 text-white transition"
                                                        >
                                                            Manage Staffs
                                                        </button>
                                                    </>
                                                )}

                                                <button
                                                    onClick={() => { setOpen(false); logout(); }}
                                                    className="w-full px-3 py-2 rounded-md bg-danger text-white hover:bg-red-600 transition"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </nav>
            </header>

            {/* Modals */}

            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                initialMode={authMode}
            />
            <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
            <AdminDashboardModal isOpen={showAdminDashboard} onClose={() => setShowAdminDashboard(false)} />
            <ManageStaffModal isOpen={showManageStaff} onClose={() => setShowManageStaff(false)} />
            <ManageServicesModal isOpen={showManageServices} onClose={() => setShowManageServices(false)} />
            <StaffDashboardModal isOpen={showStaffDashboard} onClose={() => setShowStaffDashboard(false)} />
            <MyAppointmentsModal isOpen={showMyAppointments} onClose={() => setShowMyAppointments(false)} />
        </>
    );
}