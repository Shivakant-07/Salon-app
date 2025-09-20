import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 5173,
        proxy: {
            "/api": "https://salon-backend-ktdp.onrender.com",
        },
        allowedHosts: ["8b4b3cf6835c.ngrok-free.app"],

    },
});
