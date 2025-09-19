import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import api from "../../utils/axiosInstance";

export default function ManageStaff() {
    // ------------------- STATE -------------------
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

    // ------------------- VALIDATION STATES -------------------
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // ------------------- LOAD STAFF -------------------
    const load = async () => {
        const { data } = await api.get("/staff");
        setList(data);
        setForm({ name: "", email: "", skills: "", phone: "", exp: "", position: "" });
        setEditId(null); // <-- added: reset edit state after load
        setTouched({}); // <-- added: reset validation state
        setSubmitted(false); // <-- added: reset validation submit
    };
    useEffect(() => { load(); }, []);

    // ------------------- SAVE STAFF -------------------
    const save = async () => {
        setSubmitted(true); // <-- added: trigger validation

        // validation check
        if (!form.name.trim() && !form.email.trim() || !form.skills.trim()) {
            return; // <-- prevent save if errors
        }

        if (editId) {
            // <-- added: handle update if editId exists
            await api.put(`/staff/${editId}`, {
                skills: form.skills.split(",").map(s => s.trim()),
                phone: form.phone,
            });
        } else {
            await api.post("/staff", {
                name: form.name,
                email: form.email,
                phone: form.phone,
                exp: form.exp || "0 Year of Experience",
                position: form.position || "Staff Member",
                skills: form.skills.split(",").map(s => s.trim()),
            });
        }
        // reset form after save
        setForm({ name: "", email: "", skills: "", phone: "", exp: "", position: "" });
        setEditId(null); // <-- added: clear edit mode
        load();
    };

    // ------------------- DELETE STAFF -------------------
    const remove = async (id) => {
        if (!window.confirm("Are you sure you want to delete this staff?")) return;
        await api.delete(`/staff/${id}`);
        load();
    };

    // ------------------- START EDIT STAFF -------------------
    const startEdit = (s) => {
        // <-- added: fill form with selected staff details
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

    // ------------------- TOGGLE TODAY AVAILABILITY -------------------
    const toggleToday = async (id, availableToday) => {
        await api.put(`/staff/${id}`, { availableToday: !availableToday }); // CHANGED
        load();
    };


    return (
        <>
            {/* ---------------- NAVBAR ---------------- */}
            <Navbar />

            {/* ---------------- PAGE CONTAINER ---------------- */}
            <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">

                {/* ---------------- ADD STAFF FORM ---------------- */}
                <div className="bg-white p-4 rounded-xl border space-y-3">
                    <h1 className="text-2xl font-bold">
                        {editId ? "Edit Staff" : "Add Staff"} {/* <-- added dynamic heading */}
                    </h1>

                    <div className="text-sm text-gray-500">
                        {editId
                            ? "Edit the Skills and Phone of this staff member."
                            : "Enter Name or Email of existing user & add skills to add them as Staff."}
                    </div>

                    {/* NAME FIELD */}
                    <div>
                        <input
                            className="border p-2 w-full disabled:cursor-not-allowed"
                            placeholder="Staff Name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            onBlur={() => setTouched({ ...touched, name: true })} // <-- added
                            disabled={!!editId} // <-- disable in edit mode
                        />
                        {(touched.name || submitted) && !form.name.trim() && !editId && (
                            <p className="text-red-600 text-xs mt-1">Name or Email is required</p> // <-- added
                        )}
                    </div>

                    {/* EMAIL FIELD */}
                    <div>
                        <input
                            className="border p-2 w-full disabled:cursor-not-allowed"
                            placeholder="Staff Email (Optional)"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            onBlur={() => setTouched({ ...touched, email: true })} // <-- added
                            disabled={!!editId} // <-- disable in edit mode
                        />

                    </div>

                    {/* PHONE FIELD */}
                    <div>
                        <input
                            className="border p-2 w-full"
                            placeholder="Staff Phone Number (optional)"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            onBlur={() => setTouched({ ...touched, phone: true })} // <-- added
                        />

                    </div>
                    {/* Experience */}
                    <div>
                        <input
                            className="border p-2 w-full disabled:cursor-not-allowed"
                            placeholder="Experience (e.g. 0,1 years)"
                            value={form.exp}
                            onChange={e => setForm({ ...form, exp: e.target.value })}
                            onBlur={() => setTouched({ ...touched, exp: true })} // <-- added
                        />

                    </div>

                    {/* Position */}
                    <div>
                        <input
                            className="border p-2 w-full disabled:cursor-not-allowed"
                            placeholder="Position in staff's"
                            value={form.position}
                            onChange={e => setForm({ ...form, position: e.target.value })}
                            onBlur={() => setTouched({ ...touched, position: true })} // <-- added
                        />
                    </div>

                    {/* SKILLS FIELD */}
                    <div>
                        <input
                            className="border p-2 w-full"
                            placeholder="Skills (comma separated)"
                            value={form.skills}
                            onChange={e => setForm({ ...form, skills: e.target.value })}
                            onBlur={() => setTouched({ ...touched, skills: true })} // <-- added

                        />
                        {(touched.skills || submitted) && !form.skills.trim() && (
                            <p className="text-red-600 text-xs mt-1">Skills are required</p> // <-- added
                        )}
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={save}
                            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                        >
                            {editId ? "Update" : "Save"} {/* <-- added dynamic button label */}
                        </button>
                        {editId ? (
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => {
                                    setForm({ name: "", email: "", phone: "", skills: "", exp: "", position: "" });
                                    setEditId(null);
                                    setTouched({});
                                    setSubmitted(false);
                                }}
                            >
                                Cancel
                            </button>
                        ) : <></>}
                    </div>
                </div>

                {/* ---------------- ALL STAFF LIST ---------------- */}
                <div className="bg-white p-4 rounded-xl border">
                    <h2 className="text-xl font-semibold mb-2">All Staff</h2>

                    {/* staff cards row (flex-wrap for responsiveness) */}
                    <div className="flex flex-wrap gap-3">
                        {list.map(s => (
                            <div
                                key={s._id}
                                className="p-3 border rounded-lg shadow-sm w-full flex items-center justify-between" // <-- changed layout to row
                            >

                                <div>
                                    {/* name + email */}
                                    <div className="font-medium">
                                        {s.name} (
                                        <span className="text-sm text-gray-500">
                                            {s.email}
                                        </span>
                                        )
                                    </div>


                                    <div className="text-sm text-gray-500">
                                        Phone : {s.phone}
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        Experience : {s.exp}
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        Position : {s.position}
                                    </div>

                                    {/* skills */}
                                    <div className="text-sm text-gray-700">
                                        Skills : {(s.skills || []).join(", ")}
                                    </div>
                                </div>

                                {/* Edit + Delete buttons (side by side, same as services) */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <button
                                            className="px-2 py-1 border rounded text-sm"
                                            onClick={() => { startEdit(s) }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                            onClick={() => remove(s._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Available Today:</span>
                                        <button
                                            className={`px-2 py-1 text-xs rounded ${s.availableToday
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                            onClick={() => toggleToday(s._id, s.availableToday)}
                                        >
                                            {s.availableToday ? 'Yes' : 'No'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* empty state */}
                        {!list.length && (
                            <div className="text-sm text-gray-500">No staff yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
