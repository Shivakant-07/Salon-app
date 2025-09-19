// frontend/src/pages/customer/Services.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import Navbar from "../../components/common/Navbar";
import BookingModal from "../../components/modals/BookingModal";
import AuthModal from "../../components/modals/AuthModal";

export default function Services() {
    const [services, setServices] = useState([]);
    const [q, setQ] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [showBooking, setShowBooking] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState("login");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await api.get("/services");
                setServices(data || []);
            } catch (err) {
                console.error(err);
                setServices([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const categories = Array.from(
        new Set(services.map((s) => s.category).filter(Boolean))
    );

    const filtered = services.filter((s) => {
        const searchText = (s.title || s.name || "").toLowerCase();
        if (q && !searchText.includes(q.toLowerCase())) return false;
        if (category && (s.category || "") !== category) return false;
        return true;
    });

    const handleBookService = (service) => {
        setSelectedService(service);
        setShowBooking(true);
    };

    const handleAuthRequired = () => {
        setAuthMode("login");
        setShowAuth(true);
    };

    return (
        <>
            <Navbar />
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Services</h1>

                {/* Search + Filter */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <input
                        placeholder="Search services..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="border p-2 rounded w-64"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">All categories</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => {
                            setQ("");
                            setCategory("");
                        }}
                        className="px-3 py-1 border rounded"
                    >
                        Clear
                    </button>
                </div>

                {/* Service Cards */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                        <p className="mt-2 text-gray-600">Loading services...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((s) => (
                            <div
                                key={s._id}
                                className="bg-white p-4 rounded shadow flex justify-between items-center"
                            >
                                <div className="flex-1">
                                    <div className="font-medium">{s.title || s.name}</div>
                                    <div className="text-sm text-gray-600">
                                        ₹{s.price} · {s.duration}m · {s.category}
                                    </div>
                                    {s.description && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {s.description}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleBookService(s)}
                                    className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                                >
                                    Book
                                </button>
                            </div>
                        ))}

                        {!filtered.length && (
                            <div className="text-sm text-gray-500">
                                No services found.
                            </div>
                        )}
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
                role=" "
                onAuthRequired={handleAuthRequired}
            />

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                initialMode={authMode}
            />
        </>
    );
}
