import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@rons/ui": path.resolve(__dirname, "./src/lib/ui/index.ts"),
            "@rons/utils": path.resolve(__dirname, "./src/lib/utils-pkg/index.ts"),
            "@rons/config": path.resolve(__dirname, "./src/lib/utils-pkg"),
        },
    },
    server: {
        host: "::",
        port: 5174,
    }
})
