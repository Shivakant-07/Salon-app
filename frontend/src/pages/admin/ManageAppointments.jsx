// frontend/src/pages/admin/ManageAppointments.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import Navbar from "../../components/common/Navbar";

export default function ManageAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [staff, setStaff] = useState([]);

    const load = async () => {
        try {
            const apps = (await api.get('/admin/appointments')).data;
            const staffList = (await api.get('/staff')).data;
            setAppointments(apps);
            setStaff(staffList);
        } catch (err) {
            alert('Failed to load: ' + (err.response?.data?.message || err.message));
        }
    };

    useEffect(() => { load(); }, []);

    const assign = async (appointmentId, staffUserId) => {
        try {
            await api.put(`/admin/appointments/${appointmentId}/assign`, { staffId: staffUserId });
            alert('Assigned');
            load();
        } catch (err) {
            alert('Assign failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-6xl mx-auto p-4 space-y-4">
                <h1 className="text-2xl font-bold">All Appointments</h1>
                <div className="space-y-3">
                    {appointments.map(app => (
                        <div key={app._id} className="bg-white p-3 rounded border flex justify-between items-center">
                            <div>
                                <div className="font-medium">{app.service?.title || app.service?.name} — {new Date(app.date).toLocaleString()}</div>
                                <div className="text-sm text-gray-600">Customer: {app.customer?.name || app.customer?.email} · Status: {app.status} · Staff: {app.staff?.user?.name || app.staff?.name || 'Unassigned'}</div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <select className="border p-1" onChange={(e) => assign(app._id, e.target.value)} defaultValue="">
                                    <option value="">Assign staff</option>
                                    {staff.map(s => <option key={s._id} value={s.user?._id}>{s.user?.name} — {s.skills?.join(", ")}</option>)}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
2