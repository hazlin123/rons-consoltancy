import { motion } from "framer-motion";
import { Globe, Users, Building2, Award } from "lucide-react";

export const UniversityPartners = () => {
    // Simulated university logos (in production, use actual logo images)
    const universities = [
        "Oxford", "Cambridge", "Harvard", "MIT", "Stanford",
        "Yale", "Toronto", "Melbourne", "Sydney", "Auckland",
        "Imperial", "UCL", "Edinburgh", "Manchester", "Warwick",
        "Columbia", "Princeton", "Cornell", "Penn", "Duke"
    ];

    const countries = [
        { name: "United Kingdom", flag: "🇬🇧", students: "2,500+", unis: 45 },
        { name: "United States", flag: "🇺🇸", students: "1,800+", unis: 38 },
        { name: "Canada", flag: "🇨🇦", students: "1,200+", unis: 28 },
        { name: "Australia", flag: "🇦🇺", students: "1,000+", unis: 22 },
    ];

    return (
        <section className="py-32 bg-primary relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"
            />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <span className="font-script text-5xl text-secondary block mb-3">Global Network</span>
                    <h2 className="font-sans font-black text-5xl md:text-6xl text-white mb-6">
                        200+ Partner Universities
                    </h2>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        We've built relationships with top institutions worldwide to give you the best opportunities
                    </p>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {[
                        { icon: Building2, value: "200+", label: "Universities" },
                        { icon: Globe, value: "50+", label: "Countries" },
                        { icon: Users, value: "10,000+", label: "Placements" },
                        { icon: Award, value: "98%", label: "Visa Success" }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all group"
                        >
                            <stat.icon className="w-10 h-10 text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-white/70 font-bold uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Country Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {countries.map((country, index) => (
                        <motion.div
                            key={country.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group cursor-pointer"
                        >
                            {/* Blob shadow */}
                            <div className="absolute top-2 -right-2 w-full h-full bg-secondary rounded-3xl -z-10 group-hover:rotate-6 transition-transform duration-500"></div>

                            <div className="bg-white rounded-3xl p-6 hover:shadow-2xl transition-all">
                                <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">{country.flag}</div>
                                <h3 className="font-black text-xl text-primary mb-2 text-center">{country.name}</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Students Placed:</span>
                                        <span className="font-black text-primary">{country.students}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Universities:</span>
                                        <span className="font-black text-primary">{country.unis}</span>
                                    </div>
                                </div>
                                <button className="w-full mt-4 py-2 bg-primary text-white rounded-full font-bold text-sm hover:bg-secondary hover:text-primary transition-all">
                                    Explore Programs
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* University Logos Marquee */}
                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-primary to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-primary to-transparent z-10"></div>

                    <div className="overflow-hidden">
                        <motion.div
                            animate={{ x: [0, -1920] }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="flex gap-12 py-8"
                        >
                            {[...universities, ...universities].map((uni, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-48 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20"
                                >
                                    <span className="text-white font-bold text-lg">{uni}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
