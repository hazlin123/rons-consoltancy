import { motion } from "framer-motion";
import { Plane, BookOpen, GraduationCap, Globe, ShieldCheck, Heart } from "lucide-react";

export const Services = () => {
  const steps = [
    {
      number: "01",
      icon: BookOpen,
      title: "Guidance",
      desc: "Expert assistance in choosing the right institutions and academic aspirations.",
      color: "bg-primary/5 text-primary",
      size: "col-span-1 md:col-span-2"
    },
    {
      number: "02",
      icon: GraduationCap,
      title: "Admissions",
      desc: "Support with step-by-step school applications.",
      color: "bg-secondary/10 text-secondary",
      size: "col-span-1"
    },
    {
      number: "03",
      icon: ShieldCheck,
      title: "Visa Support",
      desc: "Tailored counseling to meet individual student needs.",
      color: "bg-primary text-white",
      size: "col-span-1"
    },
    {
      number: "04",
      title: "Exam Prep",
      desc: "Comprehensive preparation for IELTS Academic & General.",
      isBrand: true,
      size: "col-span-1 md:col-span-2"
    },
  ];

  return (
    <section className="py-40 bg-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'conic-gradient(from 0deg, #064E3B, #D4AF37, #064E3B)' }} />

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] block mb-4"
            >
              Excellence Redefined
            </motion.span>
            <h2 className="font-display text-5xl md:text-7xl text-primary leading-tight">
              A Masterclass in <br /> <span className="italic text-secondary">Educational Success</span>
            </h2>
          </div>
          <p className="text-slate-400 font-medium max-w-xs text-sm leading-relaxed border-l-2 border-primary/10 pl-6">
            We don't just process applications. We curate global futures with surgical precision and artistic vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className={`group relative p-10 rounded-[3rem] overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(6,78,59,0.15)] ${step.size} ${step.isBrand ? 'bg-primary text-white' : 'bg-slate-50'}`}
            >
              {step.isBrand ? (
                <div className="h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="relative">
                      <div className="absolute inset-0 bg-secondary blur-2xl opacity-20" />
                      <img src="/logo-gold.png" alt="Rons Logo" className="w-16 h-16 object-contain relative z-10" />
                    </div>
                    <ShieldCheck className="w-8 h-8 text-secondary opacity-50" />
                  </div>
                  <div className="mt-12">
                    <h3 className="font-display text-4xl mb-4 italic">{step.title}</h3>
                    <p className="text-white/60 max-w-xs">{step.desc}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-12">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${step.color} shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500`}>
                      {step.icon && <step.icon className="w-8 h-8" />}
                    </div>
                    <span className="text-6xl font-display text-slate-200 group-hover:text-primary/20 transition-colors italic">{step.number}</span>
                  </div>
                  <h3 className="font-bold text-2xl text-primary mb-4 group-hover:translate-x-2 transition-transform">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium group-hover:translate-x-2 transition-transform delay-75">{step.desc}</p>
                </>
              )}

              {/* Decorative hover flourish */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
