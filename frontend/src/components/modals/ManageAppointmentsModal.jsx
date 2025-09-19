import React, { useEffect, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const ManageAppointmentsModal = ({ isOpen, onClose }) => {
    const [appointments, setAppointments] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            load();
        }
    }, [isOpen]);

    const load = async () => {
        try {
            setLoading(true);
            const [appsRes, staffRes] = await Promise.all([
                api.get('/admin/appointments'),
                api.get('/staff')
            ]);
            setAppointments(appsRes.data || []);
            setStaff(staffRes.data || []);
        } catch (err) {
            toast.error('Failed to load: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const assign = async (appointmentId, staffUserId) => {
        if (!staffUserId) return;
        try {
            setLoading(true);
            await api.put(`/admin/appointments/${appointmentId}/assign`, { staffId: staffUserId });
            toast.success('Staff assigned successfully');
            load();
        } catch (err) {
            toast.error('Assign failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Manage Appointments" size="xl">
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                    <p className="mt-2 text-gray-600">Loading appointments...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">All Appointments</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {appointments.length ? (
                                appointments.map(app => (
                                    <div key={app._id} className="bg-white p-4 rounded border shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="font-medium text-lg">
                                                    {app.service?.title || app.service?.name}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    {new Date(app.date).toLocaleString()}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    <span className="font-medium">Customer:</span> {app.customer?.name || app.customer?.email}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-medium">Status:</span>
                                                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${app.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        app.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                app.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-medium">Staff:</span> {app.staff?.user?.name || app.staff?.name || 'Unassigned'}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    className="border p-2 rounded text-sm"
                                                    onChange={(e) => assign(app._id, e.target.value)}
                                                    defaultValue=""
                                                >
                                                    <option value="">Assign staff</option>
                                                    {staff.map(s => (
                                                        <option key={s._id} value={s.user?._id}>
                                                            {s.user?.name} — {s.skills?.join(", ")}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-gray-500">No appointments found.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </ModalWrapper>
    );
};

export default ManageAppointmentsModal;
