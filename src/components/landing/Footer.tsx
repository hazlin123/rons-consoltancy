import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
  scholarships: {
    title: "Scholarships",
    links: [
      { name: "UK Scholarships", href: "#" },
      { name: "US Scholarships", href: "#" },
      { name: "Canada Scholarships", href: "#" },
      { name: "Australia Scholarships", href: "#" },
      { name: "European Scholarships", href: "#" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "IELTS Preparation", href: "#" },
      { name: "Application Guide", href: "#" },
      { name: "Essay Writing Tips", href: "#" },
      { name: "Interview Prep", href: "#" },
      { name: "Visa Guidance", href: "#" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Our Team", href: "#" },
      { name: "Success Stories", href: "#testimonials" },
      { name: "Careers", href: "#" },
    ],
  },
  contact: {
    title: "Get In Touch",
    links: [
      { name: "Rieti Building, 3rd Floor, Room 32, Uganda Road", href: "#" },
      { name: "+254 720 494 322", href: "tel:+254720494322" },
      { name: "ronsfuturebridge7@gmail.com", href: "mailto:ronsfuturebridge7@gmail.com" },
    ],
  },
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="bg-white text-foreground border-t border-gray-100">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <a href="/" className="flex items-center gap-4 mb-10 group">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tighter leading-none text-primary italic">
                  Rons Future Bridge
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold opacity-80 mt-1">
                  Elite Overseas Consultancy
                </span>
              </div>
            </a>
            <p className="text-primary/60 mb-10 max-w-sm font-medium leading-relaxed italic pr-4">
              Empowering the next generation of global citizens through curated access to elite international education and master-level IELTS coaching.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-11 h-11 rounded-2xl bg-primary/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-primary shadow-sm"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-display font-black text-lg text-primary mb-8 italic tracking-tight">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-primary/60 hover:text-accent transition-colors font-medium break-words leading-snug block italic tracking-tight"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary/5 border-t border-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-sm">
            <p className="text-primary/40 font-bold italic tracking-wide">
              © {new Date().getFullYear()} Rons Future Bridge. <span className="hidden sm:inline">Excellence in Global Education.</span>
            </p>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl shadow-soft border border-primary/5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Certified British Council Affiliate</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
