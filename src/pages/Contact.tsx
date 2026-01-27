import { Contact as ContactSection } from "@/components/landing/Contact";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";

export default function Contact() {
    return (
        <div className="bg-white">
            {/* Header */}
            <section className="pt-32 pb-12 bg-slate-50">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold font-display italic text-primary mb-6">Contact Us</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                        We're here to guide you through every step of your scholarship journey. Reach out to our team of experts anytime.
                    </p>
                </div>
            </section>

            {/* Reusing the high-end Contact Section */}
            <ContactSection />

            {/* Additional Info / Maps Placeholder */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="p-8">
                            <div className="w-16 h-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <MessageCircle className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-primary mb-2">Support Chat</h4>
                            <p className="text-slate-500 mb-4 text-sm">Our typical response time is under 1 hour during business days.</p>
                            <a href="#" className="text-secondary font-bold hover:underline">Start Chat</a>
                        </div>
                        <div className="p-8">
                            <div className="w-16 h-16 bg-gold-50 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                <Phone className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-primary mb-2">Direct Call</h4>
                            <p className="text-slate-500 mb-4 text-sm">Monday - Friday, 9:00 AM to 6:00 PM (EAT).</p>
                            <a href="tel:+254720494322" className="text-primary font-bold hover:underline">+254 720 494 322</a>
                        </div>
                        <div className="p-8">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-primary mb-2">Visit Office</h4>
                            <p className="text-slate-500 mb-4 text-sm">Rieti Building, 3rd Floor, Room 32, Uganda Road.</p>
                            <a href="#" className="text-primary font-bold hover:underline">Get Directions</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
