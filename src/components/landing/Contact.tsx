import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Message Sent Successfully",
      description: "Our consultancy team will get back to you shortly.",
      variant: "default",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-[3rem] overflow-hidden shadow-soft border border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Contact Info (Indigo Side) */}
            <div className="bg-primary p-12 lg:p-20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

              <h2 className="text-4xl md:text-5xl font-black mb-8">Get in <span className="text-secondary italic">Touch</span></h2>
              <p className="text-white/80 mb-12 text-lg font-medium leading-relaxed">
                Have questions about scholarships or the IELTS process? Our council experts are here to guide you.
              </p>

              <div className="space-y-8">
                <a href="mailto:ronsfuturebridge7@gmail.com" className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-secondary font-black mb-1">Email Us</div>
                    <div className="text-lg font-bold">ronsfuturebridge7@gmail.com</div>
                  </div>
                </a>

                <a href="tel:+254720494322" className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-300">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-secondary font-black mb-1">Call Us</div>
                    <div className="text-lg font-bold">+254 720 494 322</div>
                  </div>
                </a>

                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-secondary font-black mb-1">Office</div>
                    <div className="text-lg font-bold">Rieti Building, 3rd Floor, Room 32, Uganda Road</div>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-white/10">
                <a href="https://wa.me/254720494322" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full h-16 rounded-2xl border-white/20 text-white hover:bg-white hover:text-primary font-bold gap-3 text-base group shadow-lg shadow-black/5 transition-all">
                    <MessageCircle className="w-6 h-6" /> WhatsApp Support
                  </Button>
                </a>
              </div>
            </div>

            {/* Form Side */}
            <div className="p-12 lg:p-20 bg-white">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
                    <Input required placeholder="Jane Doe" className="h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-primary/20 px-6 font-semibold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Email</label>
                    <Input required placeholder="jane@example.com" type="email" className="h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-primary/20 px-6 font-semibold" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Subject</label>
                  <Input required placeholder="Masters in UK Inquiry" className="h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-primary/20 px-6 font-semibold" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Message</label>
                  <Textarea required placeholder="How can we help your journey?" className="min-h-[160px] bg-slate-50 border-none rounded-3xl focus-visible:ring-primary/20 p-6 font-semibold" />
                </div>

                <Button
                  disabled={isSubmitting}
                  className="w-full h-16 bg-primary text-white hover:shadow-hover font-black text-xl rounded-2xl group transition-all duration-300"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className={`ml-2 w-6 h-6 transition-transform ${isSubmitting ? 'translate-x-10 -translate-y-10 opacity-0' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
                </Button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
