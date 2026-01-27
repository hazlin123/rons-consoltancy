import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Globe, BookOpen, Phone, MessageCircle, User } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-background">
      {/* Atmospheric Background Elements */}
      <div className="absolute top-0 right-0 w-[60%] h-[120%] bg-primary/5 rounded-bl-[400px] -z-10 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[80%] bg-accent/5 rounded-tr-[300px] -z-10 blur-3xl opacity-30" />

      {/* Floating Elements for visual interest */}
      <div className="absolute top-1/4 left-10 hidden lg:block">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="p-4 bg-white rounded-2xl shadow-soft border border-gray-100 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Global Reach</p>
            <p className="text-[10px] text-muted-foreground">50+ Countries</p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-1/4 right-10 hidden lg:block">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="p-4 bg-white rounded-2xl shadow-soft border border-gray-100 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Expert IELTS</p>
            <p className="text-[10px] text-muted-foreground">Certified Guidence</p>
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
          <span className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-xs font-bold tracking-widest text-primary uppercase bg-primary/5 rounded-full border border-primary/10">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Official British IELTS Council Affiliate
          </span>

          {/* Mega Headline */}
          <h1 className="max-w-5xl mx-auto text-6xl md:text-8xl font-black tracking-tight text-foreground mb-8 leading-[1.05]">
            Achieve <span className="text-gradient">IELTS Success</span> with Rons Consultancy
          </h1>

          {/* Sub-headline */}
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground mb-12 font-medium leading-relaxed">
            Expert guidance for your global journey. Master the IELTS exam with Kenya's premier consultancy and unlock international career & education opportunities.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="tel:+254720494322">
              <Button size="xl" className="rounded-2xl h-16 px-10 bg-primary text-white shadow-soft transition-all duration-300 hover:shadow-hover hover:scale-[1.02] active:scale-[0.98] gap-3">
                <Phone className="w-6 h-6" /> Call Now
              </Button>
            </a>
            <Link to="/portal">
              <Button size="xl" variant="ghost" className="rounded-2xl h-16 px-10 font-bold group flex items-center gap-3 bg-white/50 backdrop-blur-sm border border-gray-100 transition-all duration-300 hover:shadow-hover hover:scale-[1.02]">
                <User className="w-6 h-6 text-primary" /> Student Portal
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
