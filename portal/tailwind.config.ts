import type { Config } from "tailwindcss";
import sharedConfig from "../../packages/config/tailwind.config";

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "../../packages/ui/src/components/**/*.{ts,tsx}"
    ],
    presets: [sharedConfig],
};

export default config;
