import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@rons/ui';

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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
};

export const RedesignedServices = () => {
    const plans = [
        { name: "GUIDANCE", price: "SELECT", period: "PRE-ADMISSION", details: ["Right institutions choice", "Academic aspirations sync"] },
        { name: "ADMISSIONS", price: "APPLY", period: "STEP-BY-STEP", details: ["School applications support", "Document preparation"] },
        { name: "VISA_SUPPORT", price: "EXPERT", period: "CONSULTANCY", details: ["Tailored counseling", "Registry assistance"] }
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex-1 flex flex-col p-8 md:p-12 pb-32 relative overflow-hidden group/services"
        >

            <motion.div variants={item} className="flex justify-between items-end w-full mb-16">
                <div>
                    <div className="text-num-condensed text-[#CCD0CF]">03</div>
                    <div className="text-label-tech mt-2 text-[#9BA8AB]/40 uppercase tracking-widest">Core Expertise</div>
                </div>
                <div className="text-right">
                    <div className="text-label-tech mb-2 text-[#9BA8AB]/40">Service Registry</div>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 128 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-[1px] bg-white/10 ml-auto"
                    />
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 flex-1 cinema-glass overflow-hidden rounded-[3rem] p-1 bg-black/[0.005] border-black/5">
                {plans.map((plan, idx) => (
                    <motion.div
                        key={idx}
                        variants={item}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                        className={`p-10 flex flex-col justify-between group transition-all duration-700 ${idx !== 2 ? 'border-r border-white/5' : ''} relative overflow-hidden`}
                    >
                        <div>
                            <div className="text-label-tech mb-12 opacity-30 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">Module_{plan.name}</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-[#CCD0CF]/10">TYPE</span>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.6 + idx * 0.1 }}
                                    className="text-5xl font-black text-[#CCD0CF] tracking-tighter uppercase"
                                >
                                    {plan.price}
                                </motion.div>
                            </div>
                            <div className="text-para-luxury mt-4 opacity-40 italic font-medium">{plan.period}</div>
                        </div>

                        <div className="space-y-4 my-8">
                            {plan.details.map((d, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + idx * 0.1 + i * 0.1 }}
                                    className="flex gap-4 items-center"
                                >
                                    <div className="w-1.5 h-1.5 bg-white/20 group-hover:bg-[#CCD0CF] transition-colors" />
                                    <span className="text-para-luxury opacity-60 font-medium group-hover:opacity-100 transition-opacity">{d}</span>
                                </motion.div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: "white" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-6 rounded-2xl bg-[#CCD0CF] text-[#06141B] font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg"
                        >
                            Inquire Module
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
