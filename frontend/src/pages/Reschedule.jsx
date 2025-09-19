// frontend/src/pages/Reschedule.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import Navbar from "../components/common/Navbar";

export default function Reschedule() {
    const { id } = useParams(); // expects appointment id in URL
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const nav = useNavigate();

    useEffect(() => {
        // optionally fetch appointment to prefill
        (async () => {
            if (!id) return;
            try {
                const { data } = await api.get(`/appointments/${id}`);
                const d = new Date(data.date);
                setDate(d.toISOString().slice(0, 10));
                setTime(d.toTimeString().slice(0, 5));
            } catch (err) {
                // ignore
            }
        })();
    }, [id]);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const newDate = new Date(`${date}T${time}`);
            await api.put(`/appointments/${id}`, { date: newDate.toISOString(), status: 'confirmed' });
            alert('Rescheduled successfully');
            nav('/profile');
        } catch (err) {
            alert('Reschedule failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Reschedule Appointment</h1>
                <form onSubmit={submit} className="bg-white p-4 rounded border space-y-3">
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border p-2 rounded" required />
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border p-2 rounded" required />
                    <button className="px-4 py-2 bg-black text-white rounded">Reschedule</button>
                </form>
            </div>
        </>
    );
}
