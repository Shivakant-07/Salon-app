import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import api from "../../utils/axiosInstance";

export default function Reports() {
    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => {
            // Simple report = list all appointments with customer/service/status
            const { data } = await api.get("/admin/reports"); // summary values
            // For listing raw appointments, you could add another endpoint if needed.
            setData([data]);
        })();
    }, []);

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-4">Reports</h1>
                <div className="bg-white p-4 rounded-xl border">
                    <pre className="text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
                </div>
            </div>
        </>
    );
}
