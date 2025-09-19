import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import api from "../../utils/axiosInstance";

export default function ManageServices() {
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

    const load = async () => setList((await api.get("/services")).data);
    useEffect(() => { load(); }, []);

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
        ) return;

        try {
            await api.post("/services", {
                ...form,
                price: Number(form.price),
                duration: Number(form.duration),
            });
            setForm({ name: "", title: "", price: "", duration: "", description: "", category: "", image: "", icon: "" });
            setTouched({});
            setSubmitted(false);
            load();
        } catch (err) {
            console.error("Save error:", err.response?.data || err.message);
        }
    };

    const update = async (id, body) => {
        try {
            await api.put(`/services/${id}`, body);
            load();
        } catch (err) {
            console.error("Update error:", err.response?.data || err.message);
        }
    };

    const remove = async (id) => {
        try {
            await api.delete(`/services/${id}`);
            load();
        } catch (err) {
            console.error("Delete error:", err.response?.data || err.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl border space-y-3">
                    <h1 className="text-2xl font-bold">Add Service</h1>

                    {/* Name */}
                    <div>
                        <input
                            className="border p-2 w-full"
                            placeholder="Name (for backend compatibility)"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            onBlur={() => setTouched({ ...touched, name: true })}
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <input
                            className="border p-2 w-full"
                            placeholder="Title (display name)"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            onBlur={() => setTouched({ ...touched, title: true })}
                        />
                        {(touched.title || submitted) && !form.title.trim() && !form.name.trim() && (
                            <p className="text-red-600 text-xs mt-1">Either name or title is required</p>
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <input
                            type="number"
                            className="border p-2 w-full"
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
                    <div>
                        <input
                            type="number"
                            className="border p-2 w-full"
                            placeholder="Duration (minutes)"
                            value={form.duration}
                            onChange={e => setForm({ ...form, duration: e.target.value })}
                            onBlur={() => setTouched({ ...touched, duration: true })}
                        />
                        {(touched.duration || submitted) && (!form.duration || form.duration <= 0) && (
                            <p className="text-red-600 text-xs mt-1">Enter a valid duration</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <textarea
                            className="border p-2 w-full h-20"
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
                            className="border p-2 w-full"
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
                            <option className="text-xs" value="Men’s Grooming">Men’s Grooming</option>
                            <option className="text-xs" value="Other">Other</option>
                        </select>
                        {form.category === "Other" && (
                            <input
                                className="border p-2 w-full mt-2"
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
                            className="border p-2 w-full"
                            placeholder="Image URL (optional)"
                            value={form.image}
                            onChange={e => setForm({ ...form, image: e.target.value })}
                        />
                    </div>

                    {/* Icon */}
                    <div>
                        <input
                            className="border p-2 w-full"
                            placeholder="Icon class (e.g., ri-scissors-line)"
                            value={form.icon}
                            onChange={e => setForm({ ...form, icon: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={save}
                        className="px-4 py-2 bg-black text-white rounded"
                    >
                        Save
                    </button>
                </div>

                {/* Services list */}
                <div className="bg-white p-4 rounded-xl border">
                    <h2 className="text-xl font-semibold mb-2">All Services</h2>
                    <div className="space-y-2">
                        {list.map(s => (
                            <div key={s._id} className="p-3 border rounded flex items-center justify-between">
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
                                        onClick={() => update(s._id, { price: s.price + 50 })}
                                        className="px-3 py-1 border rounded"
                                    >
                                        +₹50
                                    </button>
                                    <button
                                        onClick={() => remove(s._id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
