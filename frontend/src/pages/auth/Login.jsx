import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import OAuthButtons from "../../components/common/OAuthButtons";
import toast from "react-hot-toast";

export default function Login() {
    const { setUser } = useAuth();
    const nav = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    // inside submit handler in Login.jsx
    const submit = async (e) => {
        e.preventDefault();
        try {
            // note: we don't need to pass withCredentials here because axiosInstance uses withCredentials true
            const { data } = await api.post("/auth/login", form);
            // server returns { user, token }
            const token = data.token;
            const user = data.user;

            if (token) {
                localStorage.setItem("token", token);
                // set axios default header (optional, interceptor already does this)
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            }

            setUser(user); // store user in auth context

            // redirect based on role
            nav("/");
            toast("Welcome to the Salon sir!");
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get("/auth/profile");
                if (data?.user) setUser(data.user);
            } catch (err) {
                console.log("User not logged in");
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md">
                <form onSubmit={submit} className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">Login</h2>
                    <input
                        name="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        placeholder="Email"
                        className="border p-2 w-full mb-3"
                    />
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        placeholder="Password"
                        className="border p-2 w-full mb-3"
                    />
                    <button className="w-full bg-blue-600 text-white py-2 rounded">
                        Login
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <OAuthButtons />
                </div>
            </div>
        </div>
    );
}