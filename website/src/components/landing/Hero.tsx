import { Button } from "@rons/ui";
import { Link } from "react-router-dom";
import { Plane, Search, Play, ArrowRight, ShieldCheck, Globe2, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Magnetic button effect logic
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[110vh] bg-white flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Cinematic Background Layer */}
      <motion.div
        style={{ scale, opacity: 0.15 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[150px]" />
      </motion.div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-1 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#064E3B 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="flex flex-col items-center text-center">

          {/* Subtle Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">The #1 Study Abroad Partner</span>
          </motion.div>

          {/* Masterpiece Typography */}
          <motion.div
            style={{ y: y2, opacity }}
            className="relative max-w-6xl"
          >
            <h1 className="font-display text-7xl md:text-9xl xl:text-[11rem] leading-[0.85] text-primary tracking-tighter mb-8 italic relative">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                Bridging
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="block text-right pr-12 text-secondary"
              >
                Futures
              </motion.span>
              <div className="absolute -top-12 -right-4 md:-right-20 w-48 h-48 pointer-events-none opacity-20">
                <Globe2 className="w-full h-full text-primary animate-[spin_20s_linear_infinite]" />
              </div>
            </h1>
          </motion.div>

          {/* Subtext with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mt-4"
          >
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-12">
              Transforming your academic ambitions into global reality. <br />
              Expert IELTS coaching and scholarship guidance for the world's elite universities.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-6 justify-center">
              <Link to="/management">
                <Button className="h-20 px-12 rounded-[2rem] bg-primary text-white font-bold text-xl hover:bg-slate-900 transition-all shadow-2xl shadow-primary/40 gap-4 group">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>

              <Button variant="outline" className="h-20 px-12 rounded-[2rem] border-2 border-slate-100 bg-white/50 backdrop-blur-md text-primary font-bold text-xl hover:bg-white hover:border-primary transition-all gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                  <Play className="w-4 h-4 text-primary fill-current ml-0.5" />
                </div>
                View Our Legacy
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements (Layered Parallax) */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[20%] right-[10%] w-64 h-80 rounded-[3rem] overflow-hidden shadow-2xl rotate-6 hidden xl:block border-[12px] border-white z-2"
      >
        <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80" alt="Visionary Student" className="w-full h-full object-cover" />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[10%] left-[5%] w-72 h-72 rounded-[3.5rem] overflow-hidden shadow-2xl -rotate-12 hidden xl:block border-[12px] border-white z-2"
      >
        <img src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&q=80" alt="Campus Life" className="w-full h-full object-cover" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-12 right-12 glass-card p-6 rounded-[2.5rem] flex items-center gap-4 z-20 cursor-pointer hover:scale-105 transition-transform"
      >
        <div className="w-12 h-12 rounded-2xl bg-[#002855] flex items-center justify-center text-white shadow-lg shadow-[#002855]/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#002855]">Global Partners</p>
          <p className="text-xs font-bold text-primary max-w-[150px] leading-tight">UK, USA, Canada, Australia, Malta, Ireland, NZ</p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-12 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-primary/40 to-transparent"></div>
        <span className="text-[9px] uppercase tracking-[0.4em] text-primary/40 [writing-mode:vertical-lr]">Discover More</span>
      </motion.div>
    </section>
  );
};

