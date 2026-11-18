import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    // The app talks to the API on its own origin under /api (cookies stay first-party,
    // no CORS). In production a reverse proxy does the same.
    proxy: {
      "/api": {
        target: process.env.KOFFITO_API_URL ?? "http://127.0.0.1:8000",
        rewrite: (url) => url.replace(/^\/api/, ""),
      },
    },
  },
});
