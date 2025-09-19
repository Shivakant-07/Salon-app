import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/common/Navbar";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function AdminDashboard() {
    const [report, setReport] = useState({ totalAppointments: 0, completed: 0, cancelled: 0 });
    const [appointments, setAppointments] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: "all", q: "", from: "", to: "", unassignedOnly: false });
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        (async () => {
            try {
                const [{ data: rep }, { data: apps }, { data: staffData }] = await Promise.all([
                    api.get("/admin/reports"),
                    api.get("/admin/appointments"),
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
        })();
    }, []);

    const isInRange = (d) => {
        const dt = new Date(d).getTime();
        const fromOk = filters.from ? dt >= new Date(filters.from).getTime() : true;
        const toOk = filters.to ? dt <= new Date(filters.to).getTime() + 24 * 60 * 60 * 1000 - 1 : true;
        return fromOk && toOk;
    };

    const filtered = useMemo(() => {
        return (appointments || [])
            .filter(a => isInRange(a.date))
            .filter(a => (filters.status === "all" ? true : a.status === filters.status))
            .filter(a => (filters.unassignedOnly ? !a.staff : true))
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
                    new Date(a.date).toLocaleString(),
                    a.paymentStatus,
                    a.paymentProvider,
                ].map(x => (x || "").toLowerCase());
                return fields.some(f => f.includes(q));
            });
    }, [appointments, filters]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

    const refreshApps = async () => {
        const { data } = await api.get("/admin/appointments");
        setAppointments(data || []);
    };

    const assignStaff = async (appointmentId, staffId) => {
        if (!staffId) return;
        try {
            await api.put(`/admin/appointments/${appointmentId}/assign`, { staffId });
            await refreshApps();
            toast.success("Staff assigned");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to assign staff");
        }
    };

    const confirm = async (msg, fn) => {
        if (window.confirm(msg)) {
            try {
                await fn();
                toast.success("Updated");
            } catch (e) {
                toast.error(e.response?.data?.message || "Action failed");
            } finally {
                await refreshApps();
            }
        }
    };

    const quick = {
        complete: (id) => confirm("Mark this appointment as completed?", () => api.put(`/admin/appointments/${id}/complete`)),
        cancel: (id) => confirm("Cancel this appointment?", () => api.delete(`/admin/appointments/${id}`)),
    };

    const pill = (status) => {
        const map = {
            pending: "bg-yellow-100 text-yellow-800",
            confirmed: "bg-blue-100 text-blue-800",
            "checked-in": "bg-indigo-100 text-indigo-800",
            completed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
            missed: "bg-gray-200 text-gray-800",
        };
        return `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-800"}`;
    };

    const exportCsv = () => {
        const rows = [
            ["Date", "Customer", "Customer Email", "Service", "Staff", "Status", "Payment Status", "Payment Provider", "Price"],
            ...filtered.map(a => [
                new Date(a.date).toLocaleString(),
                a.customer?.name || "",
                a.customer?.email || "",
                a.service?.title || a.service?.name || "",
                a.staff?.name || "",
                a.status,
                a.paymentStatus || "",
                a.paymentProvider || "",
                a.price,
            ])
        ];
        const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "appointments.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage appointments, staff and performance.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border shadow-sm">
                        <div className="text-sm text-gray-500">Total Appointments</div>
                        <div className="text-3xl font-semibold mt-1">{report.totalAppointments}</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border shadow-sm">
                        <div className="text-sm text-gray-500">Completed</div>
                        <div className="text-3xl font-semibold mt-1 text-green-600">{report.completed}</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border shadow-sm">
                        <div className="text-sm text-gray-500">Cancelled</div>
                        <div className="text-3xl font-semibold mt-1 text-red-600">{report.cancelled}</div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border shadow-sm">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">From</label>
                            <input type="date" className="border rounded-lg px-3 py-1.5 text-sm" value={filters.from} onChange={e => { setFilters(f => ({ ...f, from: e.target.value })); setPage(1); }} />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">To</label>
                            <input type="date" className="border rounded-lg px-3 py-1.5 text-sm" value={filters.to} onChange={e => { setFilters(f => ({ ...f, to: e.target.value })); setPage(1); }} />
                        </div>
                        <select className="border rounded-lg px-3 py-1.5 text-sm" value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="checked-in">Checked-in</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="missed">Missed</option>
                        </select>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="rounded" checked={filters.unassignedOnly} onChange={e => { setFilters(f => ({ ...f, unassignedOnly: e.target.checked })); setPage(1); }} />
                            Unassigned only
                        </label>
                        <input className="border rounded-lg px-3 py-1.5 text-sm w-full sm:w-64" placeholder="Search name, service, staff..." value={filters.q} onChange={e => { setFilters(f => ({ ...f, q: e.target.value })); setPage(1); }} />
                        <button className="ml-auto px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50" onClick={exportCsv}>Export CSV</button>
                    </div>
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
                                            <th className="py-3 px-4">Staff</th>
                                            <th className="py-3 px-4">Payment</th>
                                            <th className="py-3 px-4">Assign</th>
                                            <th className="py-3 px-4">Status/Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {pageItems.map(a => {
                                            const finalized = a.status === "completed" || a.status === "cancelled";
                                            return (
                                                <tr key={a._id} className="hover:bg-gray-50">
                                                    <td className="py-3 px-4 whitespace-nowrap">{new Date(a.date).toLocaleString()}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium">{a.customer?.name}</div>
                                                        <div className="text-gray-500">Mob: {a.customer?.phone}</div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium">{a.service?.title || a.service?.name}</div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {a.staff ? (
                                                            <div>
                                                                <div className="font-medium">{a.staff?.name}</div>
                                                                <div className={`text-xs ${a.staff?.availableToday ? "text-green-600" : "text-red-600"}`}>
                                                                    {a.staff?.availableToday ? "Available" : "Not available"}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500">Unassigned</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="text-xs">
                                                            <div className="font-medium">
                                                                {(a.paymentStatus || "unpaid")} (₹{a.price})
                                                            </div>
                                                            <div className="text-gray-500">{a.paymentProvider || "-"}</div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <select
                                                            className="border rounded-lg px-2 py-1 bg-white"
                                                            defaultValue={a.staff?._id || ""}
                                                            onChange={(e) => assignStaff(a._id, e.target.value)}
                                                        >
                                                            <option value="">Select staff</option>
                                                            {staff.map(s => (
                                                                <option key={s._id} value={s._id}>
                                                                    {s.title || s.name} {s.availableToday ? "· Available" : "· Not available"}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className={pill(a.status)}>{a.status}</span>
                                                            {!finalized && (
                                                                <>
                                                                    <button className="px-2.5 py-1.5 border rounded-lg text-xs hover:bg-gray-50" onClick={() => quick.complete(a._id)}>Complete</button>
                                                                    <button className="px-2.5 py-1.5 border rounded-lg text-xs text-red-600 hover:bg-red-50" onClick={() => quick.cancel(a._id)}>Cancel</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center justify-end gap-2 px-4 py-3">
                                <button className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                                <div className="text-sm">Page {page} of {totalPages}</div>
                                <button className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}