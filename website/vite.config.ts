import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default defineConfig({
    server: {
        host: "::",
        port: 5173,
        hmr: {
            overlay: true,
        },
    },
    plugins: [react()],
    build: {
        chunkSizeWarningLimit: 1000,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@rons/ui": path.resolve(__dirname, "../packages/ui/src"),
            "@rons/utils": path.resolve(__dirname, "../packages/utils/src"),
            "@rons/config": path.resolve(__dirname, "../packages/config"),
        },
    },
});
