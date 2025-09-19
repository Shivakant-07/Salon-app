import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/axiosInstance";
import BookingModal from "../modals/BookingModal";
import AuthModal from "../modals/AuthModal";
import { useAuth } from "../../context/AuthContext";
import aboutImg from "../../assets/About.png";


const About = ({ onTeamModalOpen }) => {
    const [showTeam, setShowTeam] = useState(false);
    const [staff, setStaff] = useState([]);

    const [showBooking, setShowBooking] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const { user } = useAuth();

    const handleAuthRequired = () => {
        setAuthMode("login");
        setShowAuth(true);
    };

    useEffect(() => {
        (async () => {
            try {
                const [{ data: staffData }] = await Promise.all([
                    api.get("/staff"),
                ]);
                setStaff((staffData || []));
            } catch (error) {
                console.error("Failed to load data:", error);
                setStaff([]);
            }
        })();
    }, []);

    // Effect to open team modal when callback is triggered
    useEffect(() => {
        if (onTeamModalOpen) {
            setShowTeam(true);
        }
    }, [onTeamModalOpen]);

    const avatarFor = (u) => u.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.name || "User");

    return (
        <section id="about" className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <h2
                            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
                            style={{ fontFamily: '"Playfair Display", serif' }}
                        >
                            About Our Salon &amp; Spa
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                            For over 15 years, Bella Salon &amp; Spa has been the premier
                            destination for luxury beauty services in the heart of the city.
                            Our team of expert stylists and beauty professionals are dedicated
                            to bringing out your natural beauty while providing an exceptional
                            spa experience.
                        </p>
                        <p className="text-lg text-gray-600 mb-8">
                            We use only the finest products and cutting-edge techniques to
                            ensure you leave feeling refreshed, renewed, and absolutely
                            beautiful. Our commitment to excellence and attention to detail
                            has made us the trusted choice for discerning clients who demand
                            the best.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-rose-600 mb-2">15+</div>
                                <div className="text-gray-600">Years Experience</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-rose-600 mb-2">
                                    5000+
                                </div>
                                <div className="text-gray-600">Happy Clients</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-rose-600 mb-2">12</div>
                                <div className="text-gray-600">Expert Stylists</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-rose-600 mb-2">25+</div>
                                <div className="text-gray-600">Services Offered</div>
                            </div>
                        </div>

                        {/* Button */}
                        <button
                            onClick={() => setShowTeam(true)}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer"
                        >
                            Meet Our Team
                        </button>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-2xl">
                            <img
                                alt="About Bella Salon"
                                className="w-full h-[500px] object-cover object-top"
                                src={aboutImg}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                                    <i className="ri-award-line text-2xl text-rose-600"></i>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Award Winner</div>
                                    <div className="text-sm text-gray-600">Best Salon 2023</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated Modal */}
            <AnimatePresence>
                {showTeam && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowTeam(false)} // ✅ Close on backdrop click
                    >
                        <motion.div
                            className="bg-white rounded-lg p-8 max-w-6xl w-full max-h-[90vh] shadow-lg relative flex flex-col"
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()} // ❌ Prevent closing when clicking inside
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Meet Our Expert Team</h3>
                                <button
                                    onClick={() => setShowTeam(false)}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    <i className="ri-close-line text-2xl"></i>
                                </button>
                            </div>

                            {/* Horizontal Scroll Wrapper */}
                            <div className="relative">
                                {/* Scrollable container */}
                                <motion.div
                                    className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                                    drag="x"
                                    dragConstraints={{ left: -((staff.length - 1) * 280), right: 0 }}
                                >
                                    {staff.map((member, idx) => (
                                        <div
                                            key={idx}
                                            className="min-w-[250px] snap-center text-center flex-shrink-0"
                                        >
                                            <div className="mb-4 overflow-hidden rounded-xl">
                                                <img
                                                    alt={member.name}
                                                    src={avatarFor(member)}
                                                    className="w-full h-64 object-cover object-top"
                                                />
                                            </div>
                                            <h4 className="text-xl font-semibold text-gray-900 mb-1">
                                                {member.name}
                                            </h4>
                                            <p className="text-rose-600 font-medium mb-2">{member.position}</p>
                                            <p className="text-sm text-gray-600 mb-1">{member.exp}</p>
                                            <p className="text-sm text-gray-500">{member.skills}</p>
                                        </div>
                                    ))}
                                </motion.div>

                                {/* Left Arrow */}
                                <button
                                    onClick={() => {
                                        const scroller = document.querySelector(".team-scroll");
                                        scroller.scrollBy({ left: -300, behavior: "smooth" });
                                    }}
                                    className="absolute hidden left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
                                >
                                </button>

                                {/* Right Arrow */}
                                <button
                                    onClick={() => {
                                        const scroller = document.querySelector(".team-scroll");
                                        scroller.scrollBy({ left: 300, behavior: "smooth" });
                                    }}
                                    className="absolute hidden right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
                                >
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-600 mb-4">
                                    Our talented team is dedicated to providing you with exceptional service and helping you look and feel your best.
                                </p>
                                <button
                                    onClick={() => setShowBooking(true)}
                                    className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                                >

                                    Book an Appointment
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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

export default About;
