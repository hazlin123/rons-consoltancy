import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, GraduationCap, User, LayoutDashboard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "@/components/theme-provider";

const navLinks = [
  { name: "Scholarships", href: "#scholarships" },
  { name: "About Us", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      if (theme === 'dark') return true;
      if (theme === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };
    setIsDark(checkDark());
  }, [theme]);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  // Header morphing animation variants
  const headerVariants = {
    top: {
      width: "95%",
      maxWidth: "80rem",
      y: 24,
      borderRadius: "1.5rem",
      backgroundColor: isDark ? "rgba(19, 15, 12, 0.6)" : "rgba(255, 255, 255, 0.6)",
      borderColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(12px)",
    },
    scrolled: {
      width: "90%",
      maxWidth: "60rem",
      y: 12,
      borderRadius: "2rem",
      backgroundColor: isDark ? "rgba(19, 15, 12, 0.8)" : "rgba(255, 255, 255, 0.9)",
      borderColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(2, 44, 34, 0.05)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1)"
    }
  };

  return (
    <motion.header
      className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-none"
      initial="top"
      animate={isScrolled ? "scrolled" : "top"}
      variants={headerVariants}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-full h-16 md:h-20 flex items-center justify-between px-6 md:px-8 pointer-events-auto">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-300"
            layoutId="logo-icon"
          >
            <GraduationCap className="w-5 h-5 text-white" />
          </motion.div>
          <div className="hidden sm:flex flex-col">
            <span className="font-display font-black text-lg tracking-tight text-primary leading-none italic">
              Rons Future Bridge
            </span>
            <motion.span
              animate={{ opacity: isScrolled ? 0 : 0.8, height: isScrolled ? 0 : "auto" }}
              className="text-[9px] uppercase tracking-[0.3em] text-accent font-bold mt-1 overflow-hidden"
            >
              Elite Overseas Consultancy
            </motion.span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 hover:text-primary transition-all duration-300 relative group italic"
            >
              {link.name}
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full opacity-50" />
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <Link to="/portal" className="hidden lg:block">
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary flex items-center gap-2 rounded-xl transition-all h-10 px-4 italic group">
              {isAuthenticated ? (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                  Dashboard
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  Student Login
                </>
              )}
            </Button>
          </Link>

          <a href="#contact">
            <Button className="rounded-xl px-6 bg-primary text-white font-black uppercase tracking-[0.15em] shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95 italic h-10 text-[10px] flex items-center gap-2 group">
              Apply Now
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-primary/60 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="absolute top-24 w-[90%] md:hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 z-50 pointer-events-auto"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-lg font-black uppercase tracking-widest text-primary py-3 px-4 hover:bg-primary/5 rounded-xl transition-colors flex justify-between items-center group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </motion.a>
              ))}


              <div className="h-px bg-primary/5 my-2" />

              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-sm font-bold text-primary/60 uppercase tracking-widest">Theme</span>
                <ModeToggle />
              </div>

              <div className="h-px bg-primary/5 my-2" />

              <Link
                to="/portal"
                className="text-lg font-black uppercase tracking-widest text-accent py-3 px-4 hover:bg-accent/5 rounded-xl transition-colors flex items-center gap-3 italic"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAuthenticated ? <LayoutDashboard className="w-5 h-5" /> : <User className="w-5 h-5" />}
                {isAuthenticated ? "My Dashboard" : "Student Login"}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
