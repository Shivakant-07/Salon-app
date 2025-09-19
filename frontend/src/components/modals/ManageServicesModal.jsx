import React, { useEffect, useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const ManageServicesModal = ({ isOpen, onClose }) => {
    const [list, setList] = useState([]);
    const [form, setForm] = useState({
        name: "",
        title: "",
        price: "",
        duration: "",
        description: "",
        category: "",
        image: "",
        icon: ""
    });
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
            const { data } = await api.get("/services");
            setList(data || []);
        } catch (error) {
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    const save = async () => {
        setSubmitted(true);

        if (
            (!form.name.trim() && !form.title.trim()) ||
            !form.category.trim() ||
            !form.price ||
            form.price <= 0 ||
            !form.duration ||
            form.duration <= 0 ||
            !form.description.trim()
        ) {
            return;
        }

        try {
            setLoading(true);
            await api.post("/services", {
                ...form,
                price: Number(form.price),
                duration: Number(form.duration),
            });
            toast.success("Service added successfully");
            setForm({ name: "", title: "", price: "", duration: "", description: "", category: "", image: "", icon: "" });
            setTouched({});
            setSubmitted(false);
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save service");
        } finally {
            setLoading(false);
        }
    };

    const update = async (id, body) => {
        try {
            setLoading(true);
            await api.put(`/services/${id}`, body);
            toast.success("Service updated successfully");
            load();
        } catch (err) {
            toast.error("Failed to update service");
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            setLoading(true);
            await api.delete(`/services/${id}`);
            toast.success("Service deleted successfully");
            load();
        } catch (error) {
            toast.error("Failed to delete service");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Manage Services" size="xl">
            <div className="grid lg:grid-cols-2 gap-4">
                {/* Add Service Form */}
                <div className="bg-gray-50 px-4 rounded-xl space-y-3">
                    <h3 className="text-lg font-semibold">Add Service</h3>

                    {/* Name */}
                    <div>
                        <input
                            className="border p-2 w-full placeholder:font-light placeholder:text-gray-400 "
                            placeholder="Name (for backend compatibility)"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            onBlur={() => setTouched({ ...touched, name: true })}
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <input
                            className="border p-2 w-full placeholder:font-light placeholder:text-gray-400"
                            placeholder="Title (display name)"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            onBlur={() => setTouched({ ...touched, title: true })}
                        />
                        {(touched.title || submitted) && !form.title.trim() && !form.name.trim() && (
                            <p className="text-red-600 text-xs mt-1">Either name or title is required</p>
                        )}
                    </div>

                    {/* Price & Duration */}
                    <div className="flex gap-2">

                        {/* Price */}
                        <div className=" w-1/2">
                            <input
                                type="number"
                                className="border p-2 w-full placeholder:font-light placeholder:text-gray-400"
                                placeholder="Price"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                onBlur={() => setTouched({ ...touched, price: true })}
                            />
                            {(touched.price || submitted) && (!form.price || form.price <= 0) && (
                                <p className="text-red-600 text-xs mt-1">Enter a valid price</p>
                            )}
                        </div>

                        {/* Duration */}
                        <div className=" w-1/2">
                            <input
                                type="number"
                                className="border p-2 w-full placeholder:font-light placeholder:text-gray-400"
                                placeholder="Duration (minutes)"
                                value={form.duration}
                                onChange={e => setForm({ ...form, duration: e.target.value })}
                                onBlur={() => setTouched({ ...touched, duration: true })}
                            />
                            {(touched.duration || submitted) && (!form.duration || form.duration <= 0) && (
                                <p className="text-red-600 text-xs mt-1">Enter a valid duration</p>
                            )}
                        </div>
                    </div>


                    {/* Description */}
                    <div>
                        <textarea
                            className="border p-2 w-full placeholder:font-light placeholder:text-gray-400 h-20"
                            placeholder="Description (e.g. Hair: Professional haircuts, styling, and treatments to keep your hair looking fresh and healthy. )"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            onBlur={() => setTouched({ ...touched, description: true })}
                        />
                        {(touched.description || submitted) && !form.description.trim() && (
                            <p className="text-red-600 text-xs mt-1">Description is required</p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <select
                            className="border p-2 w-full placeholder:font-light placeholder:text-gray-400"
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                        >
                            <option className="text-xs" value="">-- Choose Category --</option>
                            <option className="text-xs" value="Hair">Hair</option>
                            <option className="text-xs" value="Skin Care">Skin Care</option>
                            <option className="text-xs" value="Nails">Nails</option>
                            <option className="text-xs" value="Makeup">Makeup</option>
                            <option className="text-xs" value="Massage">Massage</option>
                            <option className="text-xs" value="Spa">Spa</option>
                            <option className="text-xs" value="Men's Grooming">Men's Grooming</option>
                            <option className="text-xs" value="Other">Other</option>
                        </select>
                        {form.category === "Other" && (
                            <input
                                className="border p-2 w-full placeholder:font-light placeholder:text-gray-400 mt-2"
                                placeholder="Enter custom category"
                                value={form.customCategory || ""}
                                onChange={e =>
                                    setForm({ ...form, customCategory: e.target.value })
                                }
                                onBlur={() => setTouched({ ...touched, description: true })}
                            />
                        )}
                        {(touched.category || submitted) && !form.category.trim() && (
                            <p className="text-red-600 text-xs mt-1">Category is required</p>
                        )}
                    </div>

                    {/* Image URL */}
                    <div>
                        <input
                            className="border p-2 w-full placeholder:font-light placeholder:text-gray-400"
                            placeholder="Image URL (optional)"
                            value={form.image}
                            onChange={e => setForm({ ...form, image: e.target.value })}
                        />
                    </div>


                    {/* Icon */}
                    <div>
                        <input
                            className="border p-2 w-full placeholder:font-light placeholder:text-gray-400"
                            placeholder="Icon class (e.g., ri-scissors-line)"
                            value={form.icon}
                            onChange={e => setForm({ ...form, icon: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={save}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors w-full"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>

                {/* Services List */}
                <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">All Services</h3>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div>
                            <p className="mt-2 text-gray-600">Loading...</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {list.map(s => (
                                <div key={s._id} className="p-3 border rounded bg-white">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="font-medium">{s.title || s.name}</div>
                                            <div className="text-sm text-gray-600">
                                                ₹{s.price} · {s.duration}m · {s.category}
                                            </div>
                                            {s.description && (
                                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {s.description}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => update(s._id, { price: s.price + 5 })}
                                                className="px-3 py-1 border rounded text-sm hover:bg-gray-100 transition-colors"
                                            >
                                                +₹5
                                            </button>
                                            <button
                                                onClick={() => remove(s._id)}
                                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {!list.length && (
                                <div className="text-sm text-gray-500 text-center py-8">No services yet.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ModalWrapper>
    );
};

export default ManageServicesModal;
