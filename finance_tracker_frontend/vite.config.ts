import { defineConfig } from "vite"; // ✅ Import this
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000", // Backend API server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // ✅ Fix function syntax
      },
    },
  },
});
