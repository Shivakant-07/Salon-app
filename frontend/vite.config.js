import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 5173,
        proxy: {
            "/api": "http://localhost:5000",
        },
        allowedHosts: ["8b4b3cf6835c.ngrok-free.app"],

    },
});
