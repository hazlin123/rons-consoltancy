import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@rons/ui": path.resolve(__dirname, "./src/@rons/ui"),
            "@rons/config": path.resolve(__dirname, "./src/@rons/config"),
            "@rons/utils": path.resolve(__dirname, "./src/@rons/utils"),
        },
    },
    server: {
        host: "::",
        port: 5174,
    }
})
