import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BookingModal from "../modals/BookingModal";
import AuthModal from "../modals/AuthModal";

// Smooth scroll utility function
const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
};

const Footer = ({ onTeamModalOpen }) => {
    const [showBooking, setShowBooking] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const { user } = useAuth();

    const handleAuthRequired = () => {
        setAuthMode("login");
        setShowAuth(true);
    };

    const handleBookAppointment = () => {
        if (!user) {
            handleAuthRequired();
        } else {
            setShowBooking(true);
        }
    };

    const handleTeamClick = () => {
        scrollToSection('about');
        // Small delay to ensure scroll completes before opening modal
        setTimeout(() => {
            if (onTeamModalOpen) {
                onTeamModalOpen();
            }
        }, 500);
    };

    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Top Section */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Info */}
                    <div>
                        <h3
                            className="text-2xl font-bold mb-6"
                            style={{ fontFamily: '"Playfair Display", serif' }}
                        >
                            Royal Salon &amp; Spa
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Where beauty meets excellence. Experience premium hair styling,
                            rejuvenating spa treatments, and personalized beauty services.
                        </p>
                        <div className="flex space-x-4">
                            {[
                                "ri-facebook-fill",
                                "ri-instagram-line",
                                "ri-twitter-fill",
                                "ri-youtube-fill",
                            ].map((icon, i) => (
                                <button
                                    key={i}
                                    className="w-10 h-10 bg-rose-600 hover:bg-rose-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <i className={`${icon} text-lg`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { id: "services", label: "Our Services" },
                                { id: "staff", label: "Our Team", isTeam: true },
                                { id: "booking", label: "Book Appointment", isBooking: true },
                                { id: "about", label: "About Us" },
                                { id: "gallery", label: "Gallery" },
                                { id: "review", label: "Reviews" },
                                { id: "contact", label: "Contact" },
                            ].map((link, i) => (
                                <li key={i}>
                                    {link.isBooking ? (
                                        <button
                                            onClick={handleBookAppointment}
                                            className="text-gray-300 hover:text-white transition-colors cursor-pointer text-left"
                                        >
                                            {link.label}
                                        </button>
                                    ) : link.isTeam ? (
                                        <button
                                            onClick={handleTeamClick}
                                            className="text-gray-300 hover:text-white transition-colors cursor-pointer text-left"
                                        >
                                            {link.label}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => scrollToSection(link.id)}
                                            className="text-gray-300 hover:text-white transition-colors cursor-pointer text-left"
                                        >
                                            {link.label}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Services</h4>
                        <ul className="space-y-3">
                            {[
                                "Hair Styling & Cuts",
                                "Hair Coloring",
                                "Spa Treatments",
                                "Manicure & Pedicure",
                                "Makeup Services",
                                "Hair Treatments",
                            ].map((service, i) => (
                                <li key={i}>
                                    <span className="text-gray-300">{service}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <i className="ri-map-pin-line text-rose-600 mr-3 mt-1" />
                                <span className="text-gray-300">
                                    Near NIT, Aadityapur
                                    <br />
                                    Jamshedpur, Jharkhand - 831014
                                </span>
                            </div>
                            <div className="flex items-center">
                                <i className="ri-phone-line text-rose-600 mr-3" />
                                <span className="text-gray-300">+91 9876543210</span>
                            </div>
                            <div className="flex items-center">
                                <i className="ri-mail-line text-rose-600 mr-3" />
                                <span className="text-gray-300">royal@salonspa.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 mb-4 md:mb-0">
                            © 2025 Roya Salon &amp; Spa. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                                (item, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        {item}
                                    </a>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <BookingModal
                isOpen={showBooking}
                onClose={() => setShowBooking(false)}
                role={user?.role}
                onAuthRequired={handleAuthRequired}
            />
            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                initialMode={authMode}
            />
        </footer>
    );
};

export default Footer;
