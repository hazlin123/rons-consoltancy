import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Globe, BookOpen, Phone, MessageCircle, User } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#F9FAFB]">
      {/* Atmospheric Background Elements */}
      <div className="absolute top-0 right-0 w-[60%] h-[120%] bg-primary/5 rounded-bl-[400px] -z-10 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[80%] bg-primary/5 rounded-tr-[300px] -z-10 blur-3xl opacity-30" />

      {/* Floating Elements for visual interest */}
      <div className="absolute top-1/4 left-10 hidden lg:block">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="p-4 bg-white rounded-2xl shadow-soft border border-primary/5 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground italic">Global Access</p>
            <p className="text-[10px] text-muted-foreground uppercase font-black">50+ Countries</p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-1/4 right-10 hidden lg:block">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="p-4 bg-white rounded-2xl shadow-soft border border-primary/5 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground italic">Expert Guard</p>
            <p className="text-[10px] text-muted-foreground uppercase font-black">IELTS Certified</p>
          </div>
        </motion.div>
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-xs font-black tracking-[0.2em] text-primary uppercase bg-primary/5 rounded-full border border-primary/10 italic">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Official British IELTS Council Affiliate
          </span>

          {/* Mega Headline */}
          <h1 className="max-w-5xl mx-auto text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.05]">
            Achieve Success <br /> With <span className="text-primary italic">Rons Future Bridge</span>
          </h1>

          {/* Sub-headline */}
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-500 mb-12 font-medium leading-relaxed italic">
            Expert guidance for your global journey. Master the IELTS exam with Kenya's premier consultancy and unlock international career & education opportunities.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="tel:+254720494322">
              <Button size="xl" className="rounded-2xl h-16 px-10 bg-primary text-secondary shadow-xl shadow-primary/20 transition-all duration-300 hover:shadow-hover hover:scale-[1.02] active:scale-[0.98] gap-3 font-black text-lg italic mt-4">
                <Phone className="w-6 h-6" /> Call For Success
              </Button>
            </a>
            <Link to="/portal">
              <Button size="xl" variant="outline" className="rounded-2xl h-16 px-10 font-black group flex items-center gap-3 bg-white border-primary/20 text-primary transition-all duration-300 hover:bg-secondary hover:shadow-hover hover:scale-[1.02] text-lg uppercase tracking-tight">
                <User className="w-6 h-6 text-primary" /> Student Portal
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
