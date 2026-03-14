import React, { Suspense } from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@rons/ui';
const Spline = React.lazy(() => import('@splinetool/react-spline'));

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export const RedesignedHero = () => {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex-1 flex flex-col p-8 md:p-12 pb-32 relative overflow-hidden"
        >

            {/* Top Section: Index and Technical Details */}
            <motion.div variants={item} className="flex justify-between items-start w-full mb-12">
                <div className="flex items-start gap-16">
                    <div className="text-num-condensed" style={{ fontSize: '6rem' }}>01</div>
                    <div className="hidden lg:grid grid-cols-2 gap-x-12 gap-y-2 max-w-sm mt-4">
                        {[
                            { label: "Expertise:", val: "IELTS Process" },
                            { label: "Consultancy:", val: "100% VERIFIED" },
                            { label: "Specialty:", val: "Traveling to Australia" },
                            { label: "Location:", val: "Eldoret Hub Node" }
                        ].map((detail, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                            >
                                <div className="text-label-tech mb-1">{detail.label}</div>
                                <div className="text-para-luxury tracking-wider font-medium uppercase">{detail.val}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="pill-button">Explore</motion.button>
                    <div className="round-icon border-white/10">
                        <div className="grid grid-cols-2 gap-0.5">
                            {[1, 2, 3, 4].map(i => <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} className="w-1 h-1 bg-[#CCD0CF] rounded-full" />)}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                {/* Left Card: Secondary Focus */}
                <motion.div variants={item} className="lg:col-span-4 flex flex-col gap-6">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="cinema-glass flex-1 relative group overflow-hidden rounded-[2.5rem] bg-black/[0.03] border-black/5"
                    >
                        <motion.img
                            src="/img/australia-study.jpeg"
                            whileHover={{ scale: 1.1 }}
                            className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale group-hover:grayscale-0 transition-all duration-1000"
                            alt="Australia Study"
                        />

                        <div className="absolute inset-0 p-8 flex flex-col justify-between">
                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                                <div className="text-2xl font-black text-[#CCD0CF] tracking-tighter uppercase">Visa Support</div>
                                <div className="text-label-tech opacity-40 uppercase">Tailored Counseling</div>
                            </motion.div>
                            <div className="flex justify-between items-center">
                                <motion.div whileHover={{ x: 5 }} className="round-icon border-white/10 bg-white/5 backdrop-blur-md">
                                    <ArrowRight className="w-4 h-4" />
                                </motion.div>
                                <div className="bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-bold text-[#9BA8AB]/40 uppercase">Expert_Assistance</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Area: Large Focal Image & Index 02 */}
                <motion.div variants={item} className="lg:col-span-8 cinema-glass relative overflow-hidden rounded-[2.5rem] bg-black/[0.01] border-black/5 group/main">
                    <motion.img
                        src="/img/campus-student.jpeg"
                        whileHover={{ scale: 1.02 }}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-all duration-1000"
                        alt="Student on Campus"
                    />
                    {/* Overlay Grid from Image */}
                    <div className="absolute inset-0 p-12 flex flex-col justify-between">
                        <div className="flex justify-between">
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
                                <div className="text-4xl font-black text-[#CCD0CF] tracking-tighter uppercase leading-none">Bridging <br /> Futures</div>
                                <div className="text-label-tech mt-2 text-[#9BA8AB]">CONSULTANCY_NODE</div>
                            </motion.div>
                            <div className="text-right">
                                <div className="h-[2px] w-24 bg-white/10 mb-4 ml-auto overflow-hidden">
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                        className="h-full bg-[#CCD0CF] w-1/2"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                className="bg-white/5 backdrop-blur-2xl border border-white/10 p-1 rounded-full flex items-center gap-4 pr-6 group cursor-pointer hover:bg-white/10 transition-all shadow-sm"
                            >
                                <img src="/logo-gold.png" alt="RF Logo" className="w-10 h-10 object-contain" />
                                <span className="text-[10px] font-bold text-[#CCD0CF] uppercase tracking-widest">Ron's Futurebridge® Authority</span>
                                <span className="text-[#9BA8AB]/30 text-[9px]">V.2026.1</span>
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full ml-4 animate-pulse" />
                            </motion.div>
                            <div className="flex gap-2">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="pill-button px-10 py-5 text-[10px] uppercase tracking-[0.2em]">
                                    Start Journey
                                </motion.button>
                                <motion.div
                                    whileHover={{ rotate: 90 }}
                                    className="round-icon bg-[#CCD0CF] text-[#06141B] shadow-md transition-transform"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
};
