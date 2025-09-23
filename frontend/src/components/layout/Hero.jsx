import { useState } from "react";
import { Link } from "react-router-dom";
import BookingModal from "../modals/BookingModal";
import AuthModal from "../modals/AuthModal";
import { useAuth } from "../../context/AuthContext";
import HeroImg from "../../assets/Hero.png";

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


const Hero = () => {
    const [showBooking, setShowBooking] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const { user } = useAuth();

    const handleAuthRequired = () => {
        setAuthMode("login");
        setShowAuth(false);
    };

    return (
        <section
            className="relative h-screen flex items-center justify-center text-white "
            style={{
                backgroundImage: `url(${HeroImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="w-full max-w-4xl mx-auto px-6 text-center">
                <h1
                    className="text-5xl md:text-6xl font-bold mb-6"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                >
                    Royal Salon &amp; Spa
                </h1>
                <p className="text-xl md:text-2xl mb-8 font-light">
                    Where Beauty Meets Excellence
                </p>
                <p className="text-lg mb-10 max-w-2xl mx-auto opacity-90 bg-text ">
                    Experience premium hair styling, rejuvenating spa treatments, and
                    personalized beauty services in our luxurious salon
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => setShowBooking(true)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer"
                    >
                        Book Appointment
                    </button>
                    <button
                        onClick={() => scrollToSection('services')}
                        className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 whitespace-nowrap hover:scale-105 cursor-pointer"
                    >
                        View Services
                    </button>
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

export default Hero;
