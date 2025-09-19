import React, { useState, useEffect } from "react";
import ServiceCard from "../components/layout/ServiceCard";
import BookingModal from "../components/modals/BookingModal";
import AuthModal from "../components/modals/AuthModal";
import api from "../utils/axiosInstance";

const Services = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBooking, setShowBooking] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState("login");

    const load = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/services");
            setList(data || []);
        } catch (error) {
            console.error("Failed to load services:", error);
            setList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleBookService = (service) => {
        setSelectedService(service);
        setShowBooking(true);
    };

    const handleAuthRequired = () => {
        setAuthMode("login");
        setShowAuth(true);
    };


    return (
        <section id="services" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Heading */}
                <div className="text-center mb-16">
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
                        style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                        Our Services
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover our comprehensive range of beauty and wellness services,
                        each designed to enhance your natural beauty and boost your
                        confidence
                    </p>
                </div>

                {/* Service Cards */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                        <p className="mt-2 text-gray-600">Loading services...</p>
                    </div>
                ) : list.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {list.map((service, i) => (
                            <ServiceCard
                                key={service._id || i}
                                service={service}
                                onBook={handleBookService}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No services available at the moment.</p>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={showBooking}
                onClose={() => {
                    setShowBooking(false);
                    setSelectedService(null);
                }}
                preSelectedService={selectedService}
                role="customer"
                onAuthRequired={handleAuthRequired}
            />

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                initialMode={authMode}
            />
        </section>
    );
};

export default Services;
