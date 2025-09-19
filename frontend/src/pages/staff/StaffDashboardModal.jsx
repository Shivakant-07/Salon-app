import React, { useEffect, useState, useMemo } from "react";
import ModalWrapper from "../../components/common/ModalWrapper";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const StaffDashboardModal = ({ isOpen, onClose }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actingId, setActingId] = useState(null);
    const [q, setQ] = useState("");

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/appointments/staff");
            setAppointments(data || []);
        } catch (err) {
            toast.error("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchAppointments();
    }, [isOpen]);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return appointments;
        return (appointments || []).filter(a => {
            const fields = [
                a.customer?.name,
                a.customer?.email,
                a.service?.title || a.service?.name,
                a.status,
                new Date(a.date).toLocaleString(),
            ].map(x => (x || "").toLowerCase());
            return fields.some(f => f.includes(query));
        });
    }, [appointments, q]);

    const act = async (id, action) => {
        try {
            setActingId(id);
            if (action === "complete") {
                await api.put(`/appointments/complete/${id}`);
                toast.success("Appointment completed");
            } else if (action === "cancel") {
                await api.delete(`/appointments/${id}`);
                toast.success("Appointment cancelled");
            }
            await fetchAppointments();
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        } finally {
            setActingId(null);
        }
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Staff Dashboard" size="xl">
            <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">My Appointments</h1>
                    <input
                        className="border rounded-lg px-3 py-1.5 text-sm w-64"
                        placeholder="Search by name, service, status..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>

                <div className="bg-white rounded-2xl border shadow-sm">
                    {loading ? (
                        <div className="p-6 text-sm text-gray-600">Loading...</div>
                    ) : (
                        <>
                            <div className="overflow-auto max-h-[70vh] rounded-2xl">
                                <table className="min-w-full text-sm">
                                    <thead className="sticky top-0 bg-gray-50 z-10">
                                        <tr className="text-left border-b">
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Customer</th>
                                            <th className="py-3 px-4">Service</th>
                                            <th className="py-3 px-4">Status / Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filtered.map(a => {
                                            const finalized = a.status === "completed" || a.status === "cancelled";
                                            return (
                                                <tr key={a._id} className="hover:bg-gray-50">
                                                    <td className="py-3 px-4 whitespace-nowrap">
                                                        {new Date(a.date).toLocaleString()}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium">{a.customer?.name || "-"}</div>
                                                        <div className="text-gray-500">Mob: {a.customer?.phone || ""}</div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium">{a.service?.title || a.service?.name}</div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-3 py-1.5 inline-flex items-center gap-1 rounded-full text-xs font-medium ${a.status === "completed" ? "bg-green-100 text-green-800"
                                                                : a.status === "cancelled" ? "bg-red-100 text-red-800"
                                                                    : a.status === "confirmed" ? "bg-blue-100 text-blue-800"
                                                                        : a.status === "pending" ? "bg-yellow-100 text-yellow-800"
                                                                            : a.status === "checked-in" ? "bg-indigo-100 text-indigo-800"
                                                                                : "bg-gray-100 text-gray-800"
                                                                }`}>
                                                                {a.status}
                                                            </span>

                                                            {!finalized && (
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => act(a._id, "complete")}
                                                                        disabled={actingId === a._id}
                                                                        className="px-3 py-1.5 border rounded-lg text-xs bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                                                                    >
                                                                        Complete
                                                                    </button>
                                                                    <button
                                                                        onClick={() => act(a._id, "cancel")}
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
                                        {!filtered.length && (
                                            <tr>
                                                <td className="py-6 px-4 text-sm text-gray-500" colSpan={4}>
                                                    No appointments found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ModalWrapper>
    );
};

export default StaffDashboardModal;