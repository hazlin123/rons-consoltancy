import { motion, Variants } from 'framer-motion';

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } }
};

export const RedesignedAbout = () => {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex-1 flex flex-col p-6 pb-32 relative h-full justify-center"
        >
            <motion.div variants={item} className="flex justify-between items-start w-full mb-8">
                <div>
                    <div className="text-num-condensed">02</div>
                    <div className="text-label-tech mt-2 uppercase tracking-widest opacity-40">Core Purpose</div>
                </div>
                <div className="max-w-md text-right">
                    <motion.h2
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-4xl font-black text-[#CCD0CF] tracking-tighter mb-4 leading-none uppercase"
                    >
                        Ron's Futurebridge <br /> <span className="text-[#9BA8AB]/40">Consultancy Ltd</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-para-luxury font-medium"
                    >
                        We are the premiere educational consultancy agency dedicated to guiding students through the complete IELTS process and providing comprehensive support in securing admissions and successfully traveling to Australia and other renowned destinations worldwide.
                    </motion.p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 items-stretch">
                {[
                    { label: "Success Stories", val: "5K+", desc: "Verified global student reach." },
                    { label: "Passing Rate", val: "98%", desc: "Optimal IELTS calibration." },
                    { label: "Consultants", val: "24/7", desc: "Expert uplink support." }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={item}
                        whileHover={{ y: -8, backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                        className="cinema-glass p-8 flex flex-col justify-between group cursor-default bg-black/[0.005] border-black/5"
                    >
                        <div>
                            <div className="text-label-tech mb-4 opacity-50">{stat.label}</div>
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 100 }}
                                className="text-5xl font-black text-[#CCD0CF] tracking-tighter"
                            >
                                {stat.val}
                            </motion.div>
                        </div>
                        <div className="mt-8 flex justify-between items-end">
                            <p className="text-para-luxury max-w-[120px] font-medium text-sm leading-tight opacity-60 group-hover:opacity-100 transition-opacity">{stat.desc}</p>
                            <motion.div
                                whileHover={{ x: 5, backgroundColor: "#CCD0CF", color: "#06141B" }}
                                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[12px] text-[#CCD0CF] transition-colors"
                            >
                                →
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
