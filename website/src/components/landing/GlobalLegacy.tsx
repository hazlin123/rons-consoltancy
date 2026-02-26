import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Globe2, GraduationCap, Award, TrendingUp } from "lucide-react";

const metrics = [
    {
        id: 1,
        label: "Global Placements",
        value: "5,000+",
        desc: "Students placed in Ivy League & Russell Group universities.",
        icon: Globe2,
        color: "text-secondary"
    },
    {
        id: 2,
        label: "Scholarship Value",
        value: "£15M+",
        desc: "Total funding secured for our students across 12 countries.",
        icon: TrendingUp,
        color: "text-secondary"
    },
    {
        id: 3,
        label: "IELTS Band 8.0+",
        value: "92%",
        desc: "Of our students achieve elite language proficiency scores.",
        icon: Award,
        color: "text-blue-400"
    },
    {
        id: 4,
        label: "Visa Success",
        value: "99.8%",
        desc: "Near-perfect approval rate for Tier 4 and F-1 student visas.",
        icon: GraduationCap,
        color: "text-purple-400"
    }
];

export const GlobalLegacy = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="py-32 bg-primary relative overflow-hidden text-white">
            {/* Cinematic Background */}
            <div className="absolute inset-0 bg-[#022c22] opacity-50" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20 bg-fixed" />

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-secondary/20 blur-xl animate-[pulse_4s_infinite]"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 100 + 50}px`,
                            height: `${Math.random() * 100 + 50}px`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div style={{ y, opacity }} className="text-center mb-24">
                    <span className="font-script text-5xl text-secondary block mb-4">Our Legacy</span>
                    <h2 className="font-display text-6xl md:text-8xl font-medium tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                        Impact in Numbers
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-500"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 ${metric.color} group-hover:scale-110 transition-transform`}>
                                <metric.icon className="w-8 h-8" />
                            </div>

                            <div className="relative overflow-hidden mb-4">
                                <h3 className="font-display text-5xl md:text-6xl font-black">{metric.value}</h3>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            </div>

                            <h4 className="font-bold text-lg mb-2 text-white/80">{metric.label}</h4>
                            <p className="text-sm text-white/40 leading-relaxed font-medium">
                                {metric.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Cinematic Footer Line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-px w-full bg-gradient-to-r from-transparent via-secondary to-transparent mt-24 opacity-50"
                />

                <div className="text-center mt-8">
                    <p className="font-black text-[10px] uppercase tracking-[0.5em] text-secondary/60">
                        Defining Global Excellence Since 2018
                    </p>
                </div>
            </div>
        </section>
    );
};
