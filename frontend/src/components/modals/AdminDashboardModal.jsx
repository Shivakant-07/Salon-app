import React, { useEffect, useMemo, useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const AdminDashboardModal = ({ isOpen, onClose }) => {
    const [report, setReport] = useState({ totalAppointments: 0, completed: 0, cancelled: 0 });
    const [appointments, setAppointments] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ status: "all", q: "" });
    const [actingId, setActingId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [{ data: rep }, { data: apps }, { data: staffData }] = await Promise.all([
                api.get("/admin/reports"),
                api.get("/appointments/all"),
                api.get("/staff"),
            ]);
            setReport(rep || {});
            setAppointments(apps || []);
            setStaff(staffData || []);
        } catch {
            toast.error("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        return (appointments || [])
            .filter(a => (filters.status === "all" ? true : a.status === filters.status))
            .filter(a => {
                const q = filters.q.trim().toLowerCase();
                if (!q) return true;
                const fields = [
                    a.customer?.name,
                    a.customer?.email,
                    a.service?.title || a.service?.name,
                    a.staff?.name,
                    a.status,
                    String(a.price),
                ].map(x => (x || "").toLowerCase());
                return fields.some(f => f.includes(q));
            });
    }, [appointments, filters]);

    const assignStaff = async (appointmentId, staffId) => {
        if (!staffId) return;
        try {
            setLoading(true);
            await api.put(`/admin/appointments/${appointmentId}/assign`, { staffId });
            toast.success("Staff assigned successfully");
            loadData();
        } catch (error) {
            toast.error("Failed to assign staff");
        } finally {
            setLoading(false);
        }
    };

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
            await loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        } finally {
            setActingId(null);
        }
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Admin Dashboard" size="xl">
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                    <p className="mt-2 text-gray-600">Loading dashboard...</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <h3 className="text-sm font-medium text-blue-600">Total Appointments</h3>
                            <p className="text-2xl font-bold text-blue-900">{report.totalAppointments || 0}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl">
                            <h3 className="text-sm font-medium text-green-600">Completed</h3>
                            <p className="text-2xl font-bold text-green-900">{report.completed || 0}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl">
                            <h3 className="text-sm font-medium text-red-600">Cancelled</h3>
                            <p className="text-2xl font-bold text-red-900">{report.cancelled || 0}</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-9 gap-4">
                            <h3 className="text-lg font-semibold mb-4 col-span-1 pt-7">Filters</h3>
                            <div className=" col-span-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className=" col-span-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    placeholder="Search appointments..."
                                    value={filters.q}
                                    onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Appointments Table */}
                    <div className="bg-white rounded-2xl border shadow-sm mt-4">
                        <div className="overflow-auto max-h-[70vh] rounded-2xl">
                            <table className="min-w-full text-sm">
                                <thead className="sticky top-0 bg-gray-50 z-10">
                                    <tr className="text-left border-b">
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4">Customer</th>
                                        <th className="py-3 px-4">Service</th>
                                        <th className="py-3 px-4">Staff</th>
                                        <th className="py-3 px-4">Price</th>
                                        <th className="py-3 px-4">Status / Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filtered.length ? (
                                        filtered.map(a => {
                                            const finalized = a.status === "completed" || a.status === "cancelled";
                                            return (
                                                <tr key={a._id} className="hover:bg-gray-50">
                                                    {/* Date */}
                                                    <td className="py-3 px-4 whitespace-nowrap">
                                                        {new Date(a.date).toLocaleString()}
                                                    </td>

                                                    {/* Customer */}
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium">{a.customer?.name || "-"}</div>
                                                        <div className="text-gray-500">Mob: {a.customer?.phone || ""}</div>
                                                    </td>

                                                    {/* Service */}
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium">{a.service?.title || a.service?.name}</div>
                                                    </td>

                                                    {/* Staff */}
                                                    <td className="py-3 px-4">
                                                        {a.staff ? (
                                                            <div className="text-sm text-gray-600">{a.staff?.name}</div>
                                                        ) : (
                                                            <select
                                                                className="border p-1 rounded text-sm"
                                                                onChange={(e) => assignStaff(a._id, e.target.value)}
                                                                defaultValue=""
                                                            >
                                                                <option value="">Assign staff</option>
                                                                {staff.map(s => (
                                                                    <option key={s._id} value={s._id}>
                                                                        {s.name} — {s.skills?.join(", ")}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </td>

                                                    {/* Price */}
                                                    <td className="py-3 px-4">₹{a.price}</td>

                                                    {/* Status / Action */}
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
                                        })
                                    ) : (
                                        <tr>
                                            <td className="py-6 px-4 text-sm text-gray-500" colSpan={6}>
                                                No appointments found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            )}
        </ModalWrapper>
    );
};

export default AdminDashboardModal;
