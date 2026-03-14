import { motion, Variants } from 'framer-motion';
import { Button } from '@rons/ui';
import { Plane, ShieldCheck, Globe } from 'lucide-react';

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } }
};

export const RedesignedVisa = () => {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex-1 flex flex-col p-8 md:p-12 pb-32 relative overflow-hidden group"
        >

            <div className="flex justify-between items-start w-full mb-16 relative z-10">
                <motion.div variants={item}>
                    <div className="text-num-condensed text-[#CCD0CF]">04</div>
                    <div className="text-label-tech mt-2 text-[#9BA8AB]/40 uppercase tracking-widest">Visa Architecture</div>
                </motion.div>
                <div className="max-w-md text-right">
                    <motion.h2
                        variants={item}
                        className="text-5xl font-black text-[#CCD0CF] tracking-tighter mb-4 leading-none uppercase"
                    >
                        Bridging <span className="text-[#9BA8AB]/30 text-4xl block">Official Borders</span>
                    </motion.h2>
                    <motion.p variants={item} className="text-para-luxury font-medium opacity-60">
                        Our specialized consultancy ensures your transition is architected with precision, providing expert visa guidance for those seeking seamless methods for traveling to Australia and beyond.
                    </motion.p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 relative z-10">
                {[
                    {
                        title: "Document Registry",
                        icon: ShieldCheck,
                        desc: "Meticulous verification of compliance data and institutional requirements."
                    },
                    {
                        title: "Global Readiness",
                        icon: Globe,
                        desc: "Preparing you for traveling to Australia and handling international transitions with expert briefs.",
                        image: "/img/australia-study.jpeg"
                    },
                    {
                        title: "Consular Strategy",
                        icon: Plane,
                        desc: "Direct support for interview preparation and official application logic."
                    }
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        variants={item}
                        whileHover={{ y: -10, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                        className="cinema-glass p-10 flex flex-col justify-between group/card hover:bg-white/[0.03] transition-all bg-white/[0.02] border-white/5 backdrop-blur-md relative overflow-hidden"
                    >
                        {feature.image && (
                            <motion.img
                                src={feature.image}
                                whileHover={{ scale: 1.1, opacity: 0.15 }}
                                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700"
                                alt=""
                            />
                        )}
                        <div className="relative z-10">
                            <motion.div
                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-8 shadow-xl"
                            >
                                <feature.icon size={20} />
                            </motion.div>
                            <h3 className="text-2xl font-black text-[#CCD0CF] tracking-tighter uppercase mb-4 leading-none">{feature.title}</h3>
                            <p className="text-para-luxury font-medium opacity-50 group-hover/card:opacity-100 transition-opacity">{feature.desc}</p>
                        </div>
                        <div className="mt-8 relative z-10 flex items-center gap-2 text-[10px] font-bold text-[#9BA8AB] opacity-30 group-hover/card:opacity-100 transition-opacity uppercase tracking-widest">
                            Official_Module <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div variants={item} className="mt-8 relative z-10">
                <motion.button
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    className="pill-button px-10 py-6 text-xs uppercase tracking-[0.2em]"
                >
                    Initiate Visa Protocol
                </motion.button>
            </motion.div>
        </motion.div>
    );
};
