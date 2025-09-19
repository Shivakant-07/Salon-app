import React, { useEffect, useMemo, useState } from "react";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";


const BookingModal = ({ isOpen, onClose, role, preSelectedService = null, onAuthRequired = null }) => {
    const { user } = useAuth();
    const [mode, setMode] = useState("self");
    const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [form, setForm] = useState({ service: "", staff: "", date: "", time: "" });
    const [slots, setSlots] = useState([]);
    const [payMode, setPayMode] = useState("onsite");
    const [loading, setLoading] = useState(false);


    // Check authentication when modal opens
    useEffect(() => {
        if (isOpen && !user) {
            toast.error("Please login to book an appointment");
            onClose();
            if (onAuthRequired) {
                onAuthRequired();
            }
            return;
        }
    }, [isOpen, user, onClose, onAuthRequired]);

    // Load services and staff
    useEffect(() => {
        (async () => {
            try {
                const [{ data: srv }, { data: st }] = await Promise.all([
                    api.get("/services"),
                    api.get("/staff"),
                ]);
                setServices(srv || []);
                setStaff(st || []);
            } catch {
                toast.error("Failed to load services/staff");
            }
        })();
    }, []);

    // Auto-fill service when preSelectedService is provided
    useEffect(() => {
        if (preSelectedService && preSelectedService._id && isOpen) {
            setForm(prev => ({
                ...prev,
                service: preSelectedService._id,
                staff: "", // Reset staff when service changes
                time: "" // Reset time when service changes
            }));
        }
    }, [preSelectedService, isOpen]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setForm({ service: "", staff: "", date: "", time: "" });
            setCustomer({ name: "", email: "", phone: "" });
            setSlots([]);
            setMode("self");
            setPayMode("onsite");
        }
    }, [isOpen]);

    // Load slots when service/date/staff changes
    const loadSlots = async (svc, dt, stf) => {
        try {
            setSlots([]);
            if (!svc || !dt) return;
            const params = new URLSearchParams({ serviceId: svc, date: dt });
            if (stf) params.append("staffId", stf);
            const { data } = await api.get(
                `/appointments/available-slots?${params.toString()}`
            );
            setSlots(data?.slots || []);
        } catch {
            setSlots([]);
        }
    };

    useEffect(() => {
        loadSlots(form.service, form.date, form.staff);
    }, [form.service, form.date, form.staff]);

    // Validate
    const validate = () => {
        if (!user) {
            toast.error("Please login first");
            return false;
        }
        if (!form.service || !form.date || !form.time) {
            toast.error("Select service, date and time");
            return false;
        }
        if (mode === "customer") {
            if (!customer.name || !customer.phone) {
                toast.error("Customer name and phone are required");
                return false;
            }
        }
        return true;
    };

    // DateTime ISO
    const isoDate = useMemo(
        () =>
            form.date && form.time
                ? new Date(`${form.date}T${form.time}`).toISOString()
                : "",
        [form.date, form.time]
    );

    // Booking logic
    const book = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            if (user.role === "customer") {
                // Customer booking for self
                await api.post("/appointments/book", {
                    service: form.service,
                    staff: form.staff || undefined,
                    date: isoDate,
                    paymentStatus: payMode === "online" ? "paid" : "unpaid",
                });
                toast.success("Appointment booked!");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            } else if (mode === "self") {
                // Staff/Admin booking for self
                if (payMode === "online") {
                    const { data } = await api.post("/payments/create-order", {
                        serviceId: form.service,
                        staffId: form.staff || undefined,
                        date: isoDate,
                    });
                    const rzp = new window.Razorpay({
                        key: data.key,
                        amount: data.amount,
                        currency: data.currency,
                        name: "Salon Booking",
                        description: "Appointment Payment",
                        order_id: data.id,
                        handler: async (rsp) => {
                            await api.post("/appointments/book-self", {
                                service: form.service,
                                staff: form.staff || undefined,
                                date: isoDate,
                                paymentStatus: "paid",
                                paymentProvider: "razorpay",
                                paymentId: rsp.razorpay_payment_id,
                                paymentOrderId: rsp.razorpay_order_id,
                            });
                            toast.success("Booked (self) with payment");
                            setTimeout(() => {
                                window.location.href = "/";
                            }, 1000);
                        },
                    });
                    rzp.open();
                } else {
                    await api.post("/appointments/book-self", {
                        service: form.service,
                        staff: form.staff || undefined,
                        date: isoDate,
                        paymentStatus: "unpaid",
                    });
                    toast.success("Booked (self)");
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                }
            } else {
                // Staff/Admin booking for a customer
                if (payMode === "online") {
                    const { data } = await api.post("/payments/create-order", {
                        serviceId: form.service,
                        staffId: form.staff || undefined,
                        date: isoDate,
                    });
                    const rzp = new window.Razorpay({
                        key: data.key,
                        amount: data.amount,
                        currency: data.currency,
                        name: "Salon Booking",
                        description: "Appointment Payment",
                        order_id: data.id,
                        handler: async (rsp) => {
                            await api.post("/appointments/book-for", {
                                customer,
                                service: form.service,
                                staff: form.staff || undefined,
                                date: isoDate,
                                paymentStatus: "paid",
                                paymentProvider: "razorpay",
                                paymentId: rsp.razorpay_payment_id,
                                paymentOrderId: rsp.razorpay_order_id,
                            });
                            toast.success("Booked for customer (paid)");
                            setTimeout(() => {
                                window.location.href = "/";
                            }, 1000);
                        },
                    });
                    rzp.open();
                } else {
                    console.log(customer);
                    await api.post("/appointments/book-for", {
                        customer,
                        service: form.service,
                        staff: form.staff || undefined,
                        date: isoDate,
                        paymentStatus: "unpaid",
                    });
                    toast.success("Booked for customer");
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                }
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose} // ✅ Close on backdrop click
                >
                    <motion.div
                        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()} // ❌ Prevent closing when clicking inside
                    >

                        <div className="bg-white text-black rounded-2xl p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Create Booking</h2>
                                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                    ✕
                                </button>
                            </div>

                            {/* Booking form */}
                            <div className="space-y-4">
                                {/* Mode */}
                                {role !== "customer" && (
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                checked={mode === "self"}
                                                onChange={() => setMode("self")}
                                            />{" "}
                                            For self
                                        </label>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                checked={mode === "customer"}
                                                onChange={() => setMode("customer")}
                                            />{" "}
                                            For customer
                                        </label>
                                    </div>
                                )}

                                {/* Customer fields */}
                                {mode === "customer" && (
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        <input
                                            className="border p-2 rounded"
                                            placeholder="Customer name"
                                            value={customer.name}
                                            onChange={(e) =>
                                                setCustomer({ ...customer, name: e.target.value })
                                            }
                                        />
                                        <input
                                            className="border p-2 rounded"
                                            placeholder="Customer email (optional)"
                                            value={customer.email}
                                            onChange={(e) =>
                                                setCustomer({ ...customer, email: e.target.value })
                                            }
                                        />
                                        <input
                                            className="border p-2 rounded"
                                            placeholder="Customer phone"
                                            value={customer.phone}
                                            onChange={(e) =>
                                                setCustomer({ ...customer, phone: e.target.value })
                                            }
                                        />
                                    </div>
                                )}

                                {/* Service */}
                                <div>
                                    <label className="text-sm">Service</label>
                                    <select
                                        value={form.service}
                                        onChange={(e) =>
                                            setForm({ ...form, service: e.target.value, time: "" })
                                        }
                                        className="w-full border p-2 rounded"
                                    >
                                        <option value="">Select service</option>
                                        {services.map((s) => (
                                            <option key={s._id} value={s._id}>
                                                {s.title || s.name} -- ₹{s.price} · {s.duration}min.
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Staff */}
                                <div>
                                    <label className="text-sm">Assign Staff (optional)</label>
                                    <select
                                        value={form.staff}
                                        onChange={(e) => setForm({ ...form, staff: e.target.value })}
                                        className="w-full border p-2 rounded"
                                    >
                                        <option value="">Any staff</option>
                                        {staff.map((st) => (
                                            <option key={st._id} value={st._id}>
                                                {st.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date & time */}
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="date"
                                        className="border p-2 rounded"
                                        value={form.date}
                                        onChange={(e) =>
                                            setForm({ ...form, date: e.target.value, time: "" })
                                        }
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                    <select
                                        className="border p-2 rounded"
                                        value={form.time}
                                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                                        disabled={!form.service || !form.date || slots.length === 0}
                                    >
                                        <option value="">
                                            {!form.service || !form.date
                                                ? "Select date & service first"
                                                : slots.length
                                                    ? "Select a time"
                                                    : "No slots available"}
                                        </option>
                                        {slots.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Payment */}
                                <div className="border-t pt-3">
                                    <div className="text-sm font-medium mb-2">Payment</div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                checked={payMode === "onsite"}
                                                onChange={() => setPayMode("onsite")}
                                            />{" "}
                                            Pay at salon
                                        </label>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                checked={payMode === "online"}
                                                onChange={() => setPayMode("online")}
                                            />{" "}
                                            Pay now (Razorpay)
                                        </label>
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="flex justify-end">
                                    <button
                                        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                                        onClick={book}
                                        disabled={loading}
                                    >
                                        {loading ? "Processing..." : (payMode === "online" ? "Pay & Book" : "Book without paying")}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

};

export default BookingModal;