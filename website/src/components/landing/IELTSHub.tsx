import { motion } from "framer-motion";
import { BookOpen, BadgeCheck, Headphones, Globe, Trophy, TrendingUp, Star, Calculator, Clock } from "lucide-react";
import { Button, Card, CardContent } from "@rons/ui";
import { useState } from "react";

const hubFeatures = [
    {
        icon: <BookOpen className="w-6 h-6" />,
        title: "Intensive Coaching",
        description: "Personalized study plans and expert techniques to boost your band score."
    },
    {
        icon: <BadgeCheck className="w-6 h-6" />,
        title: "Official Partnership",
        description: "Official British Council & IDP registration center for hassle-free booking."
    },
    {
        icon: <Headphones className="w-6 h-6" />,
        title: "Practice Materials",
        description: "Access to 500+ mock tests, speaking recordings, and writing evaluations."
    }
];

export const IELTSHub = () => {
    const [bandScore, setBandScore] = useState({ listening: 6.5, reading: 6.0, writing: 5.5, speaking: 7.0 });
    const rawAverage = (bandScore.listening + bandScore.reading + bandScore.writing + bandScore.speaking) / 4;
    const averageScore = (Math.round(rawAverage * 2) / 2).toFixed(1);

    return (
        <section className="py-24 relative overflow-hidden bg-white">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="font-script text-5xl text-secondary block mb-3">Master IELTS</span>
                        <h2 className="text-5xl md:text-6xl font-display font-black text-primary leading-tight italic uppercase">
                            Take the world's <br /> <span className="text-secondary">most trusted</span> <br /> english test.
                        </h2>
                    </motion.div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Left: Content & Features */}
                    <div className="lg:w-1/2 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="flex flex-wrap items-center gap-4">
                                <img src="/ielts-logo-brand.png" alt="IELTS Official Partner" className="h-10 md:h-14 w-auto object-contain mix-blend-multiply opacity-90" />
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 text-red-600 font-bold text-xs uppercase tracking-widest border border-red-600/20">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                    </span>
                                    Exclusive Discounted Rates
                                </div>
                            </div>
                            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                                Join Kenya's premier IELTS training center. We provide expert guidance, official booking support, and discounted exam fees.
                            </p>
                        </motion.div>

                        <div className="grid gap-6">
                            {hubFeatures.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-secondary transition-all"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-primary mb-1">{feature.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button className="h-16 px-10 rounded-2xl bg-primary text-white font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20">
                                Book a Consultation
                            </Button>
                            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl border-2 border-primary/10 bg-white">
                                <span className="text-slate-400 text-sm font-medium">Exam Fee:</span>
                                <div className="flex flex-col">
                                    <span className="text-slate-400 line-through text-[10px] font-bold">KSH. 41,580</span>
                                    <span className="text-red-600 font-black text-xl font-display">KSH. 36,380</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Calculator & Stats */}
                    <div className="lg:w-1/2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute top-2 -right-2 w-full h-full bg-secondary rounded-[3rem] -z-10"></div>
                            <Card className="rounded-[3rem] border-2 border-primary/10 shadow-2xl p-8 bg-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                                        <Calculator className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-2xl text-primary uppercase italic">Band Calculator</h3>
                                        <p className="text-sm text-slate-500 font-medium">Estimate your potential score</p>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    {Object.entries(bandScore).map(([skill, score]) => (
                                        <div key={skill} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs font-black text-primary uppercase tracking-widest">{skill}</span>
                                                <span className="text-2xl font-black text-secondary">{score}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="4"
                                                max="9"
                                                step="0.5"
                                                value={score}
                                                onChange={(e) => setBandScore({ ...bandScore, [skill]: parseFloat(e.target.value) })}
                                                className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-primary rounded-[2rem] p-8 text-white text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-secondary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <div className="relative z-10">
                                        <div className="text-xs font-black uppercase tracking-[0.2em] mb-2 text-secondary/80">Average Band Score</div>
                                        <div className="text-7xl font-black mb-2 italic">{averageScore}</div>
                                        <div className="text-sm font-medium opacity-70 italic">
                                            {parseFloat(averageScore) >= 7.0 ? "Excellent! You're ready." : "We'll help you reach Band 8+"}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Success Stats Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Success Rate", value: "100%", icon: Trophy },
                                { label: "Band 8+ Students", value: "850+", icon: Star }
                            ].map((stat, i) => (
                                <Card key={i} className="rounded-3xl border-none bg-slate-50 p-6 text-center group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-secondary/20">
                                    <stat.icon className="w-8 h-8 text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                    <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
                                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest">{stat.label}</div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
