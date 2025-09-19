import React, { useEffect, useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const MyAppointmentsModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actingId, setActingId] = useState(null);

    // ----------------- Handle Status Update -----------------
    const handleStatusChange = (id, status) => {
        if (user.role === "customer") return; // customers cannot update

        let endpoint = "";
        if (user.role === "staff") endpoint = `/staff/appointments/${id}`;
        if (user.role === "admin") endpoint = `/admin/appointments/${id}`;

        setActingId(id);
        api.put(endpoint, { status })
            .then(({ data }) => {
                setAppointments(appointments.map(a => a._id === id ? data : a));
            })
            .catch(err => console.error(err))
            .finally(() => setActingId(null));
    };

    // ----------------- Fetch Appointments -----------------
    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            api.get("/appointments/my")
                .then(({ data }) => setAppointments(data || []))
                .catch(() => setAppointments([]))
                .finally(() => setLoading(false));
        }
    }, [isOpen, user]);

    // ----------------- Render -----------------
    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="My Appointments" size="lg">
            {loading ? (
                <div className="text-center py-8">Loading appointments...</div>
            ) : appointments.length ? (
                <div className="overflow-auto max-h-[70vh] rounded-2xl border">
                    <table className="min-w-full text-sm">
                        <thead className="sticky top-0 bg-gray-50 z-10">
                            <tr className="text-left border-b">
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Service</th>
                                <th className="py-3 px-4">Staff</th>
                                <th className="py-3 px-4">Status / Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {appointments.map(a => {
                                const finalized = a.status === "completed" || a.status === "cancelled";
                                return (
                                    <tr key={a._id} className="hover:bg-gray-50">
                                        {/* Date */}
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            {new Date(a.date).toLocaleString()}
                                        </td>

                                        {/* Service */}
                                        <td className="py-3 px-4">
                                            {a.service?.title || a.service?.name}
                                        </td>

                                        {/* Staff */}
                                        <td className="py-3 px-4">
                                            {a.staff?.name || "-"}
                                        </td>

                                        {/* Status + Actions */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`px-3 py-1.5 inline-flex items-center gap-1 rounded-full text-xs font-medium ${a.status === "completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : a.status === "cancelled"
                                                            ? "bg-red-100 text-red-800"
                                                            : a.status === "confirmed"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : a.status === "pending"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : a.status === "checked-in"
                                                                        ? "bg-indigo-100 text-indigo-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {a.status}
                                                </span>

                                                {/* Staff/Admin Actions */}
                                                {!finalized && user.role !== "customer" && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleStatusChange(a._id, "completed")}
                                                            disabled={actingId === a._id}
                                                            className="px-3 py-1.5 border rounded-lg text-xs bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                                                        >
                                                            Complete
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(a._id, "cancelled")}
                                                            disabled={actingId === a._id}
                                                            className="px-3 py-1.5 border rounded-lg text-xs bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8">No appointments found.</div>
            )}
        </ModalWrapper>
    );
};

export default MyAppointmentsModal;
