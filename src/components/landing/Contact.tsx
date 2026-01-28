import { useState } from "react";
import { motion } from "framer-motion";
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
    <section id="contact" className="py-24 bg-white dark:bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-slate-50 dark:bg-card rounded-[3rem] overflow-hidden shadow-soft border border-slate-100 dark:border-border"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Contact Info (Indigo Side) */}
            <div className="bg-primary p-12 lg:p-24 text-secondary relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl opacity-50" />

              <h2 className="text-5xl md:text-7xl font-display font-black mb-10 italic">Get in <span className="text-secondary/60">Touch</span></h2>
              <p className="text-secondary/70 mb-16 text-lg font-medium leading-relaxed italic max-w-md">
                Elite advisory services for your global transition. Our British Council certified experts are ready to curate your path to success.
              </p>

              <div className="space-y-10 relative z-10">
                <a href="mailto:ronsfuturebridge7@gmail.com" className="flex items-center gap-7 group cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-500 border border-white/5 shadow-2xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-secondary/40 font-black mb-1.5">Elite Email</div>
                    <div className="text-xl font-bold tracking-tight">ronsfuturebridge7@gmail.com</div>
                  </div>
                </a>

                <a href="tel:+254720494322" className="flex items-center gap-7 group cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-500 border border-white/5 shadow-2xl">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-secondary/40 font-black mb-1.5">Direct Line</div>
                    <div className="text-xl font-bold tracking-tight">+254 720 494 322</div>
                  </div>
                </a>

                <div className="flex items-center gap-7 group">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-500 border border-white/5 shadow-2xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-secondary/40 font-black mb-1.5">Headquarters</div>
                    <div className="text-xl font-bold tracking-tight leading-snug">Rieti Building, 3rd Floor, <br />Room 32, Uganda Road</div>
                  </div>
                </div>
              </div>

              <div className="mt-20 pt-10 border-t border-white/10">
                <a href="https://wa.me/254720494322" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full h-18 rounded-2xl border-white/10 text-white hover:bg-white hover:text-primary font-black uppercase tracking-[0.2em] gap-4 text-xs group shadow-2xl transition-all italic">
                    <MessageCircle className="w-5 h-5" /> Concierge Support
                  </Button>
                </a>
              </div>
            </div>

            {/* Form Side */}
            <div className="p-12 lg:p-24 bg-white dark:bg-card relative">
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 ml-1 italic">Full Name</label>
                    <Input required placeholder="E.g. Alexander Pierce" className="h-14 bg-primary/5 border-none rounded-2xl focus-visible:ring-primary/20 px-7 font-semibold" />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 ml-1 italic">Email Address</label>
                    <Input required placeholder="alex@premium.com" type="email" className="h-14 bg-primary/5 border-none rounded-2xl focus-visible:ring-primary/20 px-7 font-semibold" />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 ml-1 italic">Subject of Inquiry</label>
                  <Input required placeholder="Select service or scholarship" className="h-14 bg-primary/5 border-none rounded-2xl focus-visible:ring-primary/20 px-7 font-semibold" />
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 ml-1 italic">Inquiry Message</label>
                  <Textarea required placeholder="How may we facilitate your journey?" className="min-h-[180px] bg-primary/5 border-none rounded-[2rem] focus-visible:ring-primary/20 p-7 font-semibold" />
                </div>

                <Button
                  disabled={isSubmitting}
                  className="w-full h-18 bg-primary text-white hover:bg-primary/95 hover:shadow-2xl font-black text-xs uppercase tracking-[0.25em] rounded-2xl group transition-all duration-500 italic shadow-2xl shadow-primary/20"
                >
                  {isSubmitting ? "Transmitting..." : "Send Message"}
                  <Send className={`ml-3 w-4 h-4 transition-transform ${isSubmitting ? 'translate-x-12 -translate-y-12 opacity-0' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
                </Button>
              </form>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
