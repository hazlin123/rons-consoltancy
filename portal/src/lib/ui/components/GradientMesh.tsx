import { motion } from "framer-motion";

export const GradientMesh = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-white">
            {/* Mesh Layers */}
            <motion.div
                animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-r from-blue-100/40 to-violet-100/40 blur-[100px]"
            />

            <motion.div
                animate={{
                    x: [-50, 50, -50],
                    y: [-20, 20, -20]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] right-[0%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-l from-orange-100/40 to-pink-100/30 blur-[80px]"
            />

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-t from-blue-50/50 to-cyan-50/50 blur-[90px]"
            />

            {/* Noise Texture Overlay for "Tech" feel */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        </div>
    );
};
