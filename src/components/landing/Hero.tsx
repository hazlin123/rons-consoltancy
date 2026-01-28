import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Globe, BookOpen, Phone, User, Sparkles } from "lucide-react";

export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms for different layers
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  // Staggered text animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 80, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 100,
      }
    }
  };

  const floatVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 80,
        delay: 1
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-32 overflow-hidden bg-gradient-to-b from-background via-background to-primary/5"
    >
      {/* Parallax Background Layer 1 - Far */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[-20%] right-[-10%] w-[80%] h-[100%] pointer-events-none"
      >
        <div className="w-full h-full bg-gradient-to-br from-emerald-100/40 via-teal-50/30 to-transparent rounded-full blur-[150px] animate-morph" />
      </motion.div>

      {/* Parallax Background Layer 2 - Mid */}
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[-30%] left-[-15%] w-[70%] h-[90%] pointer-events-none"
      >
        <div className="w-full h-full bg-gradient-to-tr from-primary/10 via-accent/10 to-transparent rounded-full blur-[120px] animate-pulse-slow" />
      </motion.div>

      {/* Parallax Background Layer 3 - Near (Floating Orbs) */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[10%] left-[5%] w-32 h-32 pointer-events-none hidden lg:block"
      >
        <div className="w-full h-full bg-accent/20 rounded-full blur-[40px] animate-parallax-float" />
      </motion.div>

      <motion.div
        style={{ y: y3 }}
        className="absolute top-[60%] right-[8%] w-24 h-24 pointer-events-none hidden lg:block"
      >
        <div className="w-full h-full bg-primary/15 rounded-full blur-[30px] animate-parallax-float" style={{ animationDelay: "2s" }} />
      </motion.div>

      {/* Floating UI Cards - Left */}
      <motion.div
        variants={floatVariants}
        initial="hidden"
        animate="visible"
        className="absolute top-[25%] left-8 hidden xl:block z-20"
      >
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="p-5 bg-white/90 dark:bg-card/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-border/50 flex items-center gap-4 group hover:scale-105 transition-transform duration-500"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Globe className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-black text-primary italic">Global Network</p>
            <p className="text-xs text-primary/50 font-bold uppercase tracking-widest">50+ Countries</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating UI Cards - Right */}
      <motion.div
        variants={floatVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-[30%] right-8 hidden xl:block z-20"
      >
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="p-5 bg-white/90 dark:bg-card/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-border/50 flex items-center gap-4 group hover:scale-105 transition-transform duration-500"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-accent/30">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-black text-primary italic">IELTS Expert</p>
            <p className="text-xs text-primary/50 font-bold uppercase tracking-widest">Band 8+ Success</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        style={{ opacity, scale }}
        className="container relative z-10 mx-auto px-4 text-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-block mb-12">
            <span className="inline-flex items-center gap-3 px-8 py-3 text-[10px] font-black tracking-[0.5em] text-primary uppercase bg-white/80 dark:bg-primary/5 backdrop-blur-sm rounded-full border border-primary/10 shadow-lg shadow-primary/5">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              Official British Council IELTS Partner
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            </span>
          </motion.div>

          {/* Mega Headline with Character Animation */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tight text-primary mb-8 leading-[0.9]"
          >
            <span className="block">Your Global</span>
            <span className="block mt-2">
              <span className="text-accent italic">Education</span> Journey
            </span>
            <span className="block text-5xl sm:text-6xl md:text-7xl mt-4 text-primary/60 font-medium italic">
              Starts Here
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto text-lg md:text-xl text-primary/50 mb-16 font-medium leading-relaxed"
          >
            Kenya's premier overseas education consultancy. Expert IELTS preparation,
            scholarship guidance, and visa support for your international success.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a href="tel:+254720494322">
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full h-16 px-10 bg-primary text-white shadow-2xl shadow-primary/30 transition-all duration-500 hover:shadow-primary/50 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3 font-black text-sm uppercase tracking-wider">
                  <Phone className="w-5 h-5" />
                  Book Consultation
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-accent to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
            </a>
            <Link to="/portal">
              <Button
                size="lg"
                variant="outline"
                className="group relative overflow-hidden rounded-full h-16 px-10 border-2 border-primary/20 text-primary bg-white/50 dark:bg-primary/5 backdrop-blur-sm transition-all duration-500 hover:border-primary hover:bg-primary hover:text-white hover:scale-105"
              >
                <span className="flex items-center gap-3 font-black text-sm uppercase tracking-wider">
                  <User className="w-5 h-5" />
                  Student Portal
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={itemVariants}
            className="mt-20 pt-12 border-t border-primary/10 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: "500+", label: "Students Placed" },
              { value: "98%", label: "Success Rate" },
              { value: "8.5", label: "Avg. Band Score" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + i * 0.1 }}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-display font-black text-primary group-hover:text-accent transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-8 h-14 rounded-full border-2 border-primary/20 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 bg-primary/40 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
