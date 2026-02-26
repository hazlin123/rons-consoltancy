import { Button } from "@rons/ui";
import { ArrowRight, Calendar, User, Phone } from "lucide-react";

export const ConsultationSection = () => {
    return (
        <section className="relative py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left Column: Text & Value Prop (4 cols) */}
                    <div className="lg:col-span-4 space-y-6 text-center lg:text-left">
                        <h2 className="font-display font-black text-4xl lg:text-5xl text-primary leading-tight">
                            Build Your <br />
                            <span className="text-secondary">Future</span> With Us.
                        </h2>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            Get a personalized roadmap to your dream university. Our expert consultants provide end-to-end guidance from IELTS prep to visa approval.
                        </p>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-slate-800">Free Initial Assessment</div>
                                    <div className="text-xs text-slate-500">Worth KSh 5,000</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-slate-800">1-on-1 Mentorship</div>
                                    <div className="text-xs text-slate-500">Dedicated Advisor</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Column: Professional Image (4 cols) */}
                    <div className="lg:col-span-4 relative h-[500px] hidden lg:block">
                        {/* Abstract Shapes */}
                        <div className="absolute top-10 left-10 w-full h-[90%] bg-primary rounded-[3rem] -rotate-3 opacity-10"></div>
                        <div className="absolute top-0 left-0 w-full h-full rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl z-10">
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"
                                alt="Education Consultant"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary/90 to-transparent p-6 pt-20">
                                <div className="text-white font-bold text-lg">Ronald O.</div>
                                <div className="text-sky-200 text-sm">Head Consultant</div>
                            </div>
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute top-8 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce-slow">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Available Now</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Form (4 cols) */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10">
                                <h3 className="font-display font-black text-2xl text-primary mb-2">Book Appointment</h3>
                                <p className="text-sm text-slate-500 mb-6">Schedule a free 15-minute discovery call.</p>

                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
                                        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Phone Number</label>
                                        <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="+254 700 000000" />
                                    </div>

                                    <Button className="w-full h-14 bg-primary text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
                                        Request Call Back
                                    </Button>

                                    <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
                                        By submitting, you agree to our privacy policy. Your information is secure.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
