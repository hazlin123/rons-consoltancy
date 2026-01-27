import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, GraduationCap, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { name: "Scholarships", href: "#scholarships" },
  { name: "About Us", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-white/80 backdrop-blur-xl border border-primary/5 rounded-2xl shadow-soft h-16 md:h-20 flex items-center justify-between px-6 md:px-10 transition-all duration-300 hover:shadow-hover">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <GraduationCap className="w-6 h-6 text-secondary" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none italic">
              Rons Future Bridge
            </span>
            <span className="text-[10px] uppercase tracking-widest text-primary font-black">
              IELTS Experts
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link to="/portal" className="hidden lg:block">
            <Button variant="ghost" className="text-sm font-black uppercase tracking-tighter hover:bg-primary/5 hover:text-primary flex items-center gap-2 rounded-xl transition-all">
              {isAuthenticated ? (
                <>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Student Login
                </>
              )}
            </Button>
          </Link>

          <a href="#contact">
            <Button className="rounded-xl px-6 bg-primary text-secondary font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 italic">
              Join Us
            </Button>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-0 right-0 md:hidden bg-white rounded-2xl shadow-soft border border-primary/5 p-6 z-50"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-black uppercase tracking-widest text-slate-900 py-2 border-b border-slate-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}

              <Link
                to="/portal"
                className="text-lg font-black uppercase tracking-widest text-primary py-2 border-b border-slate-50 flex items-center gap-2 italic"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAuthenticated ? <LayoutDashboard className="w-5 h-5" /> : <User className="w-5 h-5" />}
                {isAuthenticated ? "My Dashboard" : "Student Login"}
              </Link>

              <div className="pt-4 flex flex-col gap-3">
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full h-12 rounded-xl bg-primary text-secondary font-black uppercase tracking-widest italic">Talk to an Expert</Button>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
