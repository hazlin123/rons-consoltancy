import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#" },
    { name: "Global Impact", href: "#legacy" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${isScrolled ? "py-4 px-6" : "py-8 px-8"
          }`}
      >
        <div
          className={`container mx-auto max-w-7xl transition-all duration-700 ${isScrolled
            ? "glass-panel rounded-[2.5rem] px-8 py-4 shadow-[0_40px_80px_-15px_rgba(30,41,59,0.15)] border-white/10"
            : "bg-transparent"
            }`}
        >
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-5 group">
              <div className="relative">
                <div className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-500 ${isScrolled ? "bg-primary/10" : "bg-white/20 opacity-0 group-hover:opacity-100"}`} />
                <div className={`relative p-2 rounded-2xl ${isScrolled ? "bg-primary shadow-xl" : "bg-white/10 text-white"} backdrop-blur-md transition-all border border-white/10 group-hover:scale-110 duration-500`}>
                  <img src="/logo-gold.png" alt="Logo" className="w-10 h-10 object-contain" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`font-display text-3xl italic tracking-tight ${isScrolled ? "text-primary" : "text-white"} transition-colors leading-none`}>Ron's</span>
                <span className={`font-sans font-black text-[9px] ${isScrolled ? "text-primary/60" : "text-white/60"} transition-colors tracking-[0.2em] uppercase mt-1`}>Futurebridge Consultancy</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-12">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group ${isScrolled ? "text-primary" : "text-white/90"
                    } hover:text-secondary`}
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">

              {/* Mobile Toggle */}
              <button
                className={`lg:hidden p-3 rounded-2xl ${isScrolled ? "bg-primary/5 text-primary" : "bg-white/10 text-white"} transition-all`}
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[200] bg-primary/95 backdrop-blur-2xl text-white p-12 flex flex-col"
          >
            <div className="flex justify-between items-center mb-20">
              <div className="flex items-center gap-4">
                <img src="/logo-gold.png" alt="Logo" className="w-16 h-16 object-contain" />
                <span className="font-display text-4xl italic">Rons</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                <X className="w-8 h-8 text-white" />
              </button>
            </div>

            <nav className="flex flex-col gap-10">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-5xl italic hover:text-secondary transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
