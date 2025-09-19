// frontend/src/pages/customer/Staff.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import api from "../../utils/axiosInstance";

export default function Staff() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/staff");
                setStaff(data || []);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const avatarFor = (u) => u.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.name || "User");

    return (
        <>
            <Navbar />
            <div id="staff" className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Our Staff</h1>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {staff.map(st => (
                            <div key={st._id} className="bg-white p-4 rounded-xl border flex items-center justify-between">
                                <div className="pr-3">
                                    <div className="font-medium">{st.name}</div>
                                    <div className="text-sm text-gray-600">{st.skills?.join(", ") || "Generalist"}</div>
                                    <div className="flex items-center gap-2 text-xs mt-1">
                                        <span className={`inline-block w-2 h-2 rounded-full ${st.availableToday ? "bg-green-600" : "bg-red-600"}`} />
                                        <span className={st.availableToday ? "text-green-600" : "text-red-600"}>
                                            {st.availableToday ? "Available today" : "Not available today"}
                                        </span>
                                    </div>
                                </div>
                                <img
                                    src={avatarFor(st)}
                                    alt={st.name}
                                    className="w-14 h-14 rounded-full object-cover border"
                                    onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(st.name || "User"); }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}