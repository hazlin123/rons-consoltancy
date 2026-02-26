import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-20 pb-10 mt-auto relative overflow-hidden">
      {/* Organic top edge mask if desired, or just clean line */}
      <div className="absolute top-0 left-0 w-full h-8 overflow-hidden z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full transform rotate-180 fill-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-6 mb-10 group">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/30 rounded-2xl blur-2xl group-hover:bg-secondary/50 transition-all duration-700" />
                <div className="relative w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-2xl shadow-inner">
                  <img src="/logo-gold.png" alt="Logo" className="w-14 h-14 object-contain" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-4xl italic text-secondary leading-none">Ron's Futurebridge</span>
                <span className="font-sans font-black text-[10px] tracking-[0.3em] uppercase text-white/40 mt-2">Consultancy Ltd</span>
              </div>
            </div>
            <p className="text-white/40 max-w-sm leading-relaxed mb-8 text-sm font-medium italic">
              "To be the leading educational Consultancy agency empowering students with the knowledge and resources needed to access world-class education."
            </p>

            <div className="flex flex-col gap-4 mb-8 text-sm text-white/60 font-medium">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span>Eldoret, Kenya</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <a href="mailto:ronsfuturebridge7@gmail.com" className="hover:text-white transition-colors">ronsfuturebridge7@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <a href="tel:+254720494322" className="hover:text-white transition-colors">+254 720 494 322</a>
              </div>
            </div>

            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary hover:scale-110 transition-all duration-500 group">
                  <Icon className="w-5 h-5 group-hover:animate-pulse" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-black text-[10px] mb-10 text-white uppercase tracking-[0.4em] opacity-40">Consultancy</h4>
            <ul className="space-y-5 text-white/60 text-sm font-medium">
              <li><a href="#" className="hover:text-secondary hover:translate-x-2 transition-all block">IELTS Mastery</a></li>
              <li><a href="#" className="hover:text-secondary hover:translate-x-2 transition-all block">Scholarship Curation</a></li>
              <li><a href="#" className="hover:text-secondary hover:translate-x-2 transition-all block">Visa Architecture</a></li>
              <li><a href="#" className="hover:text-secondary hover:translate-x-2 transition-all block">Portfolio Review</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[10px] mb-10 text-white uppercase tracking-[0.4em] opacity-40">Locations</h4>
            <ul className="space-y-5 text-white/60 text-sm font-medium">
              <li><a href="#" className="hover:text-secondary hover:translate-x-2 transition-all block">London elite</a></li>
              <li><a href="#" className="hover:text-secondary hover:translate-x-2 transition-all block">Sydney global</a></li>
              <li><a href="#" className="hover:text-secondary hover:translate-x-2 transition-all block">Toronto prime</a></li>
              <li><a href="#" className="hover:text-secondary hover:translate-x-2 transition-all block">Ivy League USA</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center text-white/20 text-[10px] font-black uppercase tracking-widest">
          <p>&copy; 2026 Ron's Futurebridge Consultancy Ltd. All rights reserved.</p>
          <div className="flex gap-10 mt-6 md:mt-0">
            <a href="#legacy" className="hover:text-white transition-colors">Global Impact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
