import { motion } from "framer-motion";
import { CheckCircle2, Target, Lightbulb } from "lucide-react";

export const AboutSection = () => {
    return (
        <section id="about" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="font-bold text-primary uppercase tracking-widest text-xs mb-4 block">Who We Are</span>
                        <h2 className="font-display text-4xl md:text-5xl text-primary mb-6">
                            Ron's Futurebridge Consultancy Ltd
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            We are the premiere educational consultancy agency dedicated to guiding students towards academic excellence by providing comprehensive support in securing admission to renowned institutions worldwide. Our mission is to bridge the gap between ambitious students and prestigious universities, ensuring a seamless and enriching educational journey.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-[2rem] shadow-sm border border-primary/10"
                        >
                            <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-display text-2xl text-primary mb-4">Our Vision</h3>
                            <p className="text-slate-500 leading-relaxed">
                                To be the leading educational consultancy agency empowering students with the knowledge and resources needed to access world-class education and achieve their career aspirations.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-primary text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px]" />
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 relative z-10">
                                <Lightbulb className="w-6 h-6 text-secondary" />
                            </div>
                            <h3 className="font-display text-2xl text-white mb-4 relative z-10">Our Mission</h3>
                            <ul className="space-y-3 relative z-10">
                                {[
                                    "Collaborate with top universities worldwide.",
                                    "Offer expert counseling & career planning.",
                                    "Simplify application & visa processes."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                                        <span className="text-white/80 text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
