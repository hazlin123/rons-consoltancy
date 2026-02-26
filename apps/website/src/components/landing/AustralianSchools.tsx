import { motion, Variants } from 'framer-motion';
import { MapPin, GraduationCap, DollarSign, ArrowRight } from 'lucide-react';

const schools = [
    {
        name: "Australia Institute of Business Technology",
        shortName: "AIBT",
        cities: ["Melbourne", "Brisbane", "Sydney"],
        program: "Diploma",
        tuition: "30,000 AUD",
        description: "A leading provider of nationally recognised vocational qualifications across business and technology disciplines in major Australian cities.",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
        accent: "#54ACBF",
    },
    {
        name: "Australia Vocational Training College",
        shortName: "AVTC",
        cities: ["Hobart", "Sydney", "Tasmania"],
        program: "Diploma",
        tuition: "30,000 AUD",
        description: "Offering hands-on practical training with industry-experienced trainers across Tasmania's most vibrant educational hubs.",
        image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80",
        accent: "#D4AF37",
    },
    {
        name: "National Polytechnic College",
        shortName: "NPC",
        cities: ["Sydney"],
        program: "Diploma",
        tuition: "30,000 AUD",
        description: "Located in the heart of Sydney CBD, NPC provides world-class facilities and internationally recognised qualifications for global careers.",
        image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=800&q=80",
        accent: "#CCD0CF",
    },
    {
        name: "Reach Community College",
        shortName: "RCC",
        cities: ["Hobart", "Melbourne", "Sydney"],
        program: "Diploma",
        tuition: "30,000 AUD",
        description: "An RTO established in 2013, offering diverse diplomas in Business, IT, Community Services, and Hospitality with inspiring CBD campuses.",
        image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
        accent: "#9BA8AB",
    }
];

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } }
};

export const AustralianSchools = () => {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex-1 flex flex-col p-8 md:p-12 pb-32 relative overflow-hidden"
        >

            {/* Header */}
            <div className="flex justify-between items-start w-full mb-10">
                <motion.div variants={item}>
                    <div className="text-num-condensed text-[#CCD0CF]">05</div>
                    <div className="text-label-tech mt-2 text-[#9BA8AB]/40 uppercase tracking-widest">Partner Institutions</div>
                </motion.div>
                <div className="text-right max-w-sm">
                    <motion.div variants={item} className="flex items-center justify-end gap-3 mb-3">
                        <span className="text-[10px] font-bold text-[#9BA8AB]/40 uppercase tracking-[0.2em]">Destination</span>
                        <span className="text-2xl">🇦🇺</span>
                    </motion.div>
                    <motion.h2 variants={item} className="text-4xl font-black text-[#CCD0CF] tracking-tighter leading-none uppercase">
                        Australia <br />
                        <span className="text-[#9BA8AB]/30 text-2xl">Certified Programs</span>
                    </motion.h2>
                    <motion.p variants={item} className="text-para-luxury font-medium mt-2 opacity-50 text-sm max-w-xs ml-auto">
                        Nationally recognized diplomas starting at 30,000 AUD/year in Australia's most vibrant cities.
                    </motion.p>
                </div>
            </div>

            {/* Schools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-1 items-stretch">
                {schools.map((school, i) => (
                    <motion.div
                        key={i}
                        variants={item}
                        whileHover={{ y: -8, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                        className="cinema-glass group relative overflow-hidden flex flex-col bg-white/[0.02] border-white/5 transition-all duration-500 cursor-default"
                    >
                        {/* Campus Image */}
                        <div className="relative h-44 overflow-hidden">
                            <motion.img
                                src={school.image}
                                alt={school.name}
                                whileHover={{ scale: 1.1 }}
                                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-1000"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#06141B] via-[#06141B]/40 to-transparent" />

                            {/* Short name badge */}
                            <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border"
                                style={{ color: school.accent, borderColor: `${school.accent}40`, backgroundColor: `${school.accent}15` }}>
                                {school.shortName}
                            </div>

                            {/* Flag */}
                            <div className="absolute top-4 right-4 text-lg">🇦🇺</div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1 justify-between">
                            <div>
                                <h3 className="text-sm font-black text-[#CCD0CF] tracking-tight leading-tight uppercase mb-2">
                                    {school.name}
                                </h3>
                                <p className="text-[11px] text-[#9BA8AB]/50 leading-relaxed font-medium mb-4">
                                    {school.description}
                                </p>
                            </div>

                            <div className="space-y-2">
                                {/* Cities */}
                                <div className="flex items-start gap-2 text-[10px] text-[#9BA8AB]/40 font-medium">
                                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" style={{ color: school.accent }} />
                                    <span>{school.cities.join(', ')}</span>
                                </div>

                                {/* Program */}
                                <div className="flex items-center gap-2 text-[10px] text-[#9BA8AB]/40 font-medium">
                                    <GraduationCap className="w-3 h-3 shrink-0" style={{ color: school.accent }} />
                                    <span>{school.program}</span>
                                </div>

                                {/* Tuition */}
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-1.5">
                                        <DollarSign className="w-3 h-3 text-[#CCD0CF]/30" />
                                        <span className="text-xs font-black text-[#CCD0CF] tracking-tight">{school.tuition}</span>
                                        <span className="text-[9px] text-[#9BA8AB]/30">/yr</span>
                                    </div>
                                    <motion.div
                                        whileHover={{ x: 5, scale: 1.2 }}
                                        className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                                        style={{ backgroundColor: `${school.accent}20`, borderColor: `${school.accent}40` }}
                                    >
                                        <ArrowRight className="w-3 h-3" style={{ color: school.accent }} />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom CTA bar */}
            <motion.div variants={item} className="mt-6 flex items-center justify-between">
                <div className="text-[9px] font-bold text-[#9BA8AB]/20 uppercase tracking-[0.3em]">
                    All programs are CRICOS registered · Nationally Recognised Training (NRT)
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="pill-button px-8 py-4 text-[10px] uppercase tracking-[0.2em]"
                >
                    Apply Now ↗
                </motion.button>
            </motion.div>
        </motion.div>
    );
};
