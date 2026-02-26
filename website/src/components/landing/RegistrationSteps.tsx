import { motion, Variants } from 'framer-motion';
import { ClipboardList, UserCheck, CalendarDays, Rocket } from 'lucide-react';

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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } }
};

export const RegistrationSteps = () => {
    const steps = [
        { title: "Browse Scholarships", desc: "Explore curated global opportunities tailored to your goals." },
        { title: "Preparation", desc: "Expert guidance on document prep and IELTS requirements." },
        { title: "Fast Application", desc: "Apply directly through our streamlined portal logic." },
        { title: "Expert Review", desc: "Review by Council experts to maximize your success probability." }
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex-1 flex flex-col p-6 pb-32 relative h-full justify-center"
        >
            <div className="flex justify-between items-start w-full mb-8">
                <motion.div variants={item}>
                    <div className="text-num-condensed text-[#CCD0CF]">06</div>
                    <div className="text-label-tech mt-2 text-[#9BA8AB]/40 uppercase tracking-widest">Protocol Milestones</div>
                </motion.div>
                <div className="text-right max-w-xs">
                    <motion.div variants={item} className="text-label-tech mb-4 text-[#9BA8AB]/40">Success Roadmap</motion.div>
                    <motion.p variants={item} className="text-para-luxury font-medium text-[#CCD0CF]">
                        We simplify the elite scholarship application process into four curated milestones.
                    </motion.p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 items-stretch">
                {steps.map((step, idx) => (
                    <motion.div
                        key={idx}
                        variants={item}
                        whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                        className="cinema-glass p-6 flex flex-col justify-between group transition-all cursor-default relative overflow-hidden bg-white/[0.005] border-white/5"
                    >
                        <motion.div
                            initial={{ opacity: 0.1 }}
                            whileHover={{ opacity: 0.2, scale: 1.1 }}
                            className="absolute top-0 right-0 p-6 text-4xl font-black text-[#CCD0CF] transition-colors"
                        >
                            {(idx + 1).toString().padStart(2, '0')}
                        </motion.div>

                        <div>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mb-6 bg-white/10 group-hover:bg-[#CCD0CF] transition-all"
                            >
                                <div className="w-2 h-2 bg-[#CCD0CF] group-hover:bg-[#06141B] rounded-full translate-x-[1px]" />
                            </motion.div>
                            <h3 className="text-xl font-black text-[#CCD0CF] tracking-tighter uppercase mb-2 leading-none">{step.title}</h3>
                        </div>

                        <div className="space-y-2 mt-4">
                            <p className="text-para-luxury opacity-60 leading-snug text-sm font-medium group-hover:opacity-100 transition-opacity">
                                {step.desc}
                            </p>
                            <div className="text-label-tech text-[8px] opacity-20">SYSTEM_STATUS: ACTIVE</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

