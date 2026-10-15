import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
    root: "src",
    base: "./",
    publicDir: "../public",
    server: { host: "127.0.0.1", port: 5173, strictPort: true },
    preview: { host: "127.0.0.1", port: 4173, strictPort: true },
    plugins: [preact()],
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        target: "es2020",
        modulePreload: false,
    },
});
