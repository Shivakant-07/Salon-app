import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BookingModal from "../modals/BookingModal";
import AuthModal from "../modals/AuthModal";
import BookingImg from "../../assets/BookingCTA.png";

const BookingCTA = () => {
    const [showBooking, setShowBooking] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const { user } = useAuth();

    const handleAuthRequired = () => {
        setAuthMode("login");
        setShowAuth(true);
    };

    return (
        <section
            className="py-20 relative text-white"
            style={{
                backgroundImage:
                    `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${BookingImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="max-w-4xl mx-auto px-6 text-center">
                {/* Heading */}
                <h2
                    className="text-4xl md:text-5xl font-bold mb-6"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                >
                    Ready to Transform Your Look?
                </h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                    Book your appointment today and let our expert team help you discover
                    your most beautiful self. We can't wait to pamper you!
                </p>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-calendar-check-line text-2xl text-white"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                        <p className="opacity-90">Simple online booking or call us directly</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-user-star-line text-2xl text-white"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Expert Stylists</h3>
                        <p className="opacity-90">
                            Certified professionals with years of experience
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-heart-line text-2xl text-white"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Premium Care</h3>
                        <p className="opacity-90">
                            Personalized service tailored to your needs
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => setShowBooking(true)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer"
                    >
                        Book Appointment
                    </button>
                    <a
                        href="tel:+919876543210"
                        className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer"
                    >
                        +91 9876543210
                    </a>
                </div>
            </div>
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
        </section>
    );
};

export default BookingCTA;
