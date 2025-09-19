import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";

export default function Profile() {
    const [me, setMe] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: "", phone: "" });
    const [passwords, setPasswords] = useState({ newPassword: "" });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    useEffect(() => {
        (async () => {
            try {
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
            }
        })();
    }, []);

    const onPickAvatar = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setAvatarFile(f);
        setAvatarPreview(URL.createObjectURL(f));
    };

    const handleSave = async () => {
        try {
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
        }
    };

    const currentAvatar =
        avatarPreview ||
        me?.avatarUrl ||
        "https://ui-avatars.com/api/?name=" + encodeURIComponent(me?.name || "User");

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <h1 className="text-2xl font-bold">My profile</h1>

                    <div className="mt-3 flex items-center gap-4">
                        <img
                            src={currentAvatar}
                            alt="avatar"
                            className="w-16 h-16 rounded-full object-cover border"
                            onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(me?.name || "User"); }}
                        />
                        {!editing && (
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={() => setEditing(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {editing ? (
                        <div className="mt-3 text-sm space-y-2">
                            <div>
                                <label className="block text-gray-600 text-sm">Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onPickAvatar}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm">Name</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm">Phone</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>

                            <div className="mt-4 border-t pt-3">
                                <h2 className="font-semibold mb-2">Change Password</h2>
                                <input
                                    type="password"
                                    className="w-full border p-2 rounded"
                                    placeholder="Enter New password"
                                    value={passwords.newPassword}
                                    onChange={e => setPasswords({ newPassword: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-2 mt-3">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSave}>
                                    Save
                                </button>
                                <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-3 text-gray-700 text-sm space-y-1">
                            <div><b>Name:</b> {me?.name}</div>
                            <div><b>Email:</b> {me?.email}</div>
                            <div><b>Phone:</b> {me?.phone}</div>
                            <div><b>Role:</b> {me?.role}</div>
                        </div>
                    )}
                </div>

                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <h2 className="text-xl font-semibold mb-3">My Appointments</h2>
                    <div className="space-y-2">
                        {appointments.length ? (
                            appointments.map(a => (
                                <div key={a._id} className="p-3 border rounded">
                                    <div className="font-medium">
                                        {a.service?.title || a.service?.name}
                                        {a.staff && <> · with {a.staff?.name || a.staff?.email}</>}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {new Date(a.date).toLocaleString()} — {a.status}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500">No appointments yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}