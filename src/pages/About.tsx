import { GraduationCap, Award, Globe, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="bg-slate-50 pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full" />
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="bg-secondary/10 text-secondary border-none px-4 py-1 uppercase tracking-widest font-bold mb-6">Established 2018</Badge>
                        <h1 className="text-5xl md:text-7xl font-bold font-display italic text-primary mb-8 leading-tight">
                            Bridging the gap between <span className="text-secondary italic">Ambition</span> and <span className="text-secondary italic">Opportunity</span>
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed font-light">
                            ScholarPath is an official British IELTS Council affiliate dedicated to empowering students with the resources they need to access global education.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
                                <img src="https://images.unsplash.com/photo-1523050335102-c32509142ec0?auto=format&fit=crop&q=80&w=800" alt="Students" className="w-full" />
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary rounded-full -z-10 mix-blend-multiply opacity-20 animate-pulse" />
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold text-primary font-display italic">Our Mission</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                We believe that financial barriers should never stand in the way of academic excellence. Our mission is to democratize access to international scholarships by providing a transparent, efficient, and AI-powered platform for students worldwide.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                                {[
                                    "100% Verified Scholarships",
                                    "IELTS Preparation Support",
                                    "Expert Application Review",
                                    "Direct University Partnerships"
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 items-center">
                                        <CheckCircle2 className="w-6 h-6 text-secondary" />
                                        <span className="font-semibold text-primary">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Button size="lg" className="h-16 px-10 bg-primary hover:bg-primary/95 font-bold rounded-2xl shadow-xl shadow-primary/20">
                                Explore Opportunities
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Numbers Section */}
            <section className="bg-primary py-24 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        <div>
                            <div className="text-5xl font-bold text-secondary mb-2 font-display">50k+</div>
                            <div className="text-sm uppercase tracking-widest text-primary-foreground/50 font-bold">Students Assisted</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-secondary mb-2 font-display">£15M</div>
                            <div className="text-sm uppercase tracking-widest text-primary-foreground/50 font-bold">Funding Unlocked</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-secondary mb-2 font-display">120+</div>
                            <div className="text-sm uppercase tracking-widest text-primary-foreground/50 font-bold">Partner Universities</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-secondary mb-2 font-display">98%</div>
                            <div className="text-sm uppercase tracking-widest text-primary-foreground/50 font-bold">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={`inline-block rounded-full ${className}`}>
        {children}
    </span>
);
