import { motion } from "framer-motion";
import { Globe, Lightbulb, TrendingUp, Award, ArrowUpRight } from "lucide-react";

const features = [
  {
    title: "Global University Network",
    description: "Direct partnerships with 50+ elite institutions across the UK, USA, Canada, and Australia.",
    icon: Globe,
    color: "bg-blue-50 text-blue-600",
    delay: 0
  },
  {
    title: "Expert Mentorship",
    description: "One-on-one guidance from scholars who have successfully navigated the Ivy League application process.",
    icon: Lightbulb,
    color: "bg-amber-50 text-amber-600",
    delay: 0.2
  },
  {
    title: "98% Visa Success Rate",
    description: "Our specialized legal team ensures your documentation is flawless, maximizing your approval chances.",
    icon: TrendingUp,
    color: "bg-primary/5 text-primary",
    delay: 0.4
  }
];

export const Testimonials = () => {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-accent mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-accent"></span>
              Why Choose Excellence
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-primary leading-[0.95] tracking-tight">
              Elevate Your <br />
              <span className="italic text-primary/40">Academic Future</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md"
          >
            <p className="text-primary/60 text-lg font-medium leading-relaxed">
              We don't just process applications; we architect educational journeys that transform lives and careers.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: feature.delay }}
              className="group relative h-[400px] rounded-[2.5rem] bg-white dark:bg-card border border-primary/5 dark:border-primary/10 p-8 flex flex-col justify-between overflow-hidden cursor-pointer shadow-soft hover:shadow-2xl transition-all duration-500"
            >
              {/* Hover Background */}
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

              {/* Content Layer */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center group-hover:bg-white/10 group-hover:text-white transition-colors duration-500`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <div className="w-10 h-10 rounded-full border border-primary/10 group-hover:border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-display font-black text-primary mb-4 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-primary/60 font-medium leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 border border-primary/10 text-primary font-bold text-xs uppercase tracking-widest">
            <Award className="w-4 h-4 text-accent" />
            <span>Trusted by 500+ Scholars Worldwide</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
