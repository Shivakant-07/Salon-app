import React, { useEffect, useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const ProfileModal = ({ isOpen, onClose }) => {
    const [me, setMe] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: "", phone: "" });
    const [passwords, setPasswords] = useState({ newPassword: "" });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        if (isOpen) {
            loadProfile();
        }
    }, [isOpen]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/auth/profile");
            if (!data?.user) throw new Error("Profile not found");
            setMe(data.user);
            setForm({ name: data.user.name || "", phone: data.user.phone || "" });

            if (data.user.role === "customer") {
                try {
                    const { data: myAppointments } = await api.get("/appointments/my");
                    setAppointments(myAppointments || []);
                } catch {
                    setAppointments([]);
                }
            } else {
                setAppointments([]);
            }
        } catch {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const onPickAvatar = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setAvatarFile(f);
        setAvatarPreview(URL.createObjectURL(f));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const fd = new FormData();
            fd.append("name", form.name);
            fd.append("phone", form.phone);
            if (passwords.newPassword) fd.append("newPassword", passwords.newPassword);
            if (avatarFile) fd.append("avatar", avatarFile);

            const { data: updated } = await api.put("/auth/profile", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (!updated?.user) throw new Error("Update failed");
            setMe(updated.user);
            setEditing(false);
            setPasswords({ newPassword: "" });
            setAvatarFile(null);
            setAvatarPreview("");

            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const currentAvatar =
        avatarPreview ||
        me?.avatarUrl ||
        "https://ui-avatars.com/api/?name=" + encodeURIComponent(me?.name || "User");

    let filteredAppointments = appointments;
    if (user?.role !== "customer" && user?._id) {
        filteredAppointments = appointments.filter(a => {
            // handle both populated and non-populated customer
            const customerId = a.customer?._id || a.customer;
            return String(customerId) === String(user._id);
        });
    }

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Profile" size="md">
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                    <p className="mt-2 text-gray-600">Loading profile...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-4">
                            <img
                                src={currentAvatar}
                                alt="avatar"
                                className="w-16 h-16 rounded-full object-cover border"
                                onError={(e) => {
                                    e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(me?.name || "User");
                                }}
                            />
                            {!editing && (
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {editing ? (
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-gray-600 text-sm font-medium mb-1">Photo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onPickAvatar}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm font-medium mb-1">Name</label>
                                    <input
                                        className="w-full border p-2 rounded"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm font-medium mb-1">Phone</label>
                                    <input
                                        className="w-full border p-2 rounded"
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-2">Change Password</h3>
                                    <input
                                        type="password"
                                        className="w-full border p-2 rounded"
                                        placeholder="Enter New password"
                                        value={passwords.newPassword}
                                        onChange={e => setPasswords({ newPassword: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                        onClick={handleSave}
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                                        onClick={() => setEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 text-gray-700 space-y-2">
                                <div><span className="font-medium">Name:</span> {me?.name}</div>
                                <div><span className="font-medium">Email:</span> {me?.email}</div>
                                <div><span className="font-medium">Phone:</span> {me?.phone}</div>
                                <div><span className="font-medium">Role:</span> {me?.role}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </ModalWrapper>
    );
};

export default ProfileModal;
