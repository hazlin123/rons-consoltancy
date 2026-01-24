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
      { name: "Contact", href: "#contact" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-8 group">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter leading-none">
                  Rons Consultancy
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  The Journey Begins
                </span>
              </div>
            </a>
            <p className="text-muted-foreground mb-8 max-w-sm font-medium leading-relaxed">
              Empowering the next generation of Kenyan leaders through simplified access to world-class education and expert IELTS support.
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
              <h4 className="font-black text-sm uppercase tracking-widest mb-6 text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
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
      <div className="bg-slate-50 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
            <p className="text-muted-foreground font-medium">
              © {new Date().getFullYear()} Rons IELTS Consultancy. <span className="hidden sm:inline">Crafted for Excellence.</span>
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-soft border border-gray-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-primary">Official British IELTS Affiliate</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
