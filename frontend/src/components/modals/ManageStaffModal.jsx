import React, { useEffect, useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const ManageStaffModal = ({ isOpen, onClose }) => {
    const [list, setList] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        skills: "",
        exp: "",
        position: "",
    });
    const [editId, setEditId] = useState(null);
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            load();
        }
    }, [isOpen]);

    const load = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/staff");
            setList(data || []);
            setForm({ name: "", email: "", skills: "", phone: "", exp: "", position: "" });
            setEditId(null);
            setTouched({});
            setSubmitted(false);
        } catch (error) {
            toast.error("Failed to load staff");
        } finally {
            setLoading(false);
        }
    };

    const save = async () => {
        setSubmitted(true);

        if (
            (!form.name.trim() && !form.email.trim()) ||
            !form.skills.trim()
        ) {
            return;
        }

        try {
            setLoading(true);
            if (editId) {
                await api.put(`/staff/${editId}`, {
                    skills: form.skills.split(",").map(s => s.trim()),
                    phone: form.phone,
                    exp: form.exp,
                    position: form.position,
                });
                toast.success("Staff updated successfully");
            } else {
                await api.post("/staff", {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    exp: form.exp || "0 Year of Experience",
                    position: form.position || "Staff Member",
                    skills: form.skills.split(",").map(s => s.trim()),
                });
                toast.success("Staff added successfully");
            }
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save staff");
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Are you sure you want to delete this staff?")) return;
        try {
            setLoading(true);
            await api.delete(`/staff/${id}`);
            toast.success("Staff deleted successfully");
            load();
        } catch (error) {
            toast.error("Failed to delete staff");
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (s) => {
        setForm({
            name: s.name,
            email: s.email,
            phone: s.phone,
            exp: s.exp,
            position: s.position,
            skills: (s.skills || []).join(", "),
        });
        setEditId(s._id);
    };


    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Manage Staff" size="xl">
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Add/Edit Staff Form */}
                <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                    <h3 className="text-lg font-semibold">
                        {editId ? "Edit Staff" : "Add Staff"}
                    </h3>

                    <div className="text-sm text-gray-600">
                        {editId
                            ? "Edit the Skills and Phone of this staff member."
                            : "Enter Name or Email of existing user & add skills to add them as Staff."}
                    </div>

                    {/* Name Field */}
                    <div>
                        <input
                            className="border p-2 w-full placeholder:font-light placeholder:text-gray-400 disabled:cursor-not-allowed"
                            placeholder="Staff Name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            onBlur={() => setTouched({ ...touched, name: true })}
                            disabled={!!editId}
                        />
                        {(touched.name || submitted) && !form.name.trim() && !editId && (
                            <p className="text-red-600 text-xs mt-1">Name or Email is required</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <input
                            className="border p-2 w-full placeholder:font-light placeholder:text-gray-400 disabled:cursor-not-allowed"
                            placeholder="Staff Email (Optional)"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            onBlur={() => setTouched({ ...touched, email: true })}
                            disabled={!!editId}
                        />
                    </div>

                    {/* Phone Field */}
                    <div>
                        <input
                            className="border p-2 w-full placeholder:font-light placeholder:text-gray-400"
                            placeholder="Staff Phone Number (optional)"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            onBlur={() => setTouched({ ...touched, phone: true })}
                        />
                    </div>

                    {/* Experience */}
                    <div>
                        <input
                            className="border p-2 w-full placeholder:font-light placeholder:text-gray-400 disabled:cursor-not-allowed"
                            placeholder="Experience (e.g. 0,1 years)"
                            value={form.exp}
                            onChange={e => setForm({ ...form, exp: e.target.value })}
                            onBlur={() => setTouched({ ...touched, exp: true })}
                        />
                    </div>

                    {/* Position */}
                    <div>
                        <input
                            className="border p-2 w-full placeholder:font-light placeholder:text-gray-400 disabled:cursor-not-allowed"
                            placeholder="Position in staff's"
                            value={form.position}
                            onChange={e => setForm({ ...form, position: e.target.value })}
                            onBlur={() => setTouched({ ...touched, position: true })}
                        />
                    </div>

                    {/* Skills Field */}
                    <div>
                        <input
                            className="border p-2 w-full placeholder:font-light placeholder:text-gray-400"
                            placeholder="Skills (comma separated)"
                            value={form.skills}
                            onChange={e => setForm({ ...form, skills: e.target.value })}
                            onBlur={() => setTouched({ ...touched, skills: true })}
                        />
                        {(touched.skills || submitted) && !form.skills.trim() && (
                            <p className="text-red-600 text-xs mt-1">Skills are required</p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={save}
                            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : (editId ? "Update" : "Save")}
                        </button>
                        {editId && (
                            <button
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                                onClick={() => {
                                    setForm({ name: "", email: "", phone: "", skills: "", exp: "", position: "" });
                                    setEditId(null);
                                    setTouched({});
                                    setSubmitted(false);
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* Staff List */}
                <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">All Staff</h3>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div>
                            <p className="mt-2 text-gray-600">Loading...</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {list.map(s => (
                                <div key={s._id} className="p-3 border rounded-lg bg-white">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="font-medium">
                                                {s.name} (
                                                <span className="text-sm text-gray-500">
                                                    {s.email}
                                                </span>
                                                )
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Phone: {s.phone}
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                Experience: {s.exp}
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                Position: {s.position}
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                Skills: {(s.skills || []).join(", ")}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <button
                                                    className="px-2 py-1 border rounded text-sm hover:bg-gray-100 transition-colors"
                                                    onClick={() => startEdit(s)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                                    onClick={() => remove(s._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {!list.length && (
                                <div className="text-sm text-gray-500 text-center py-8">No staff yet.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ModalWrapper>
    );
};

export default ManageStaffModal;
