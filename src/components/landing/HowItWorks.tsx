import { motion } from "framer-motion";
import { Search, FileText, Send, UserCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Scholarships",
    description: "Explore our curated list of global opportunities tailored to your academic background and goals.",
    color: "bg-primary/5 text-primary"
  },
  {
    icon: FileText,
    title: "Preparation",
    description: "Get comprehensive guidance on document preparation, including personal statements and IELTS requirements.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Send,
    title: "Fast Application",
    description: "Apply directly through our portal with streamlined processes and real-time status tracking.",
    color: "bg-primary/5 text-primary"
  },
  {
    icon: UserCheck,
    title: "Expert Review",
    description: "Our council experts review your application to maximize your chances of success.",
    color: "bg-primary/10 text-primary"
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 bg-white dark:bg-background overflow-hidden relative">
      {/* Background Texture */}
      <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-gradient-to-bl from-accent/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-24"
        >
          <div className="inline-block mb-6">
            <span className="px-4 py-1.5 rounded-full border border-primary/10 bg-primary/5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Simplified Process
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black text-primary mb-6 tracking-tight">
            Your Path to <span className="italic text-accent relative inline-block">
              Success
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-primary/60 text-lg font-medium italic tracking-wide">
            We simplify the elite scholarship application process into four curated milestones.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative"
        >
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-20 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-transparent via-primary/10 to-transparent -z-10">
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.9 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring" as const, stiffness: 60, damping: 15 }
                }
              }}
              className="relative group pt-4"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-10 w-32 h-32 group-hover:-translate-y-4 transition-transform duration-500 ease-out">
                  {/* Icon Background Blob */}
                  <div className={`absolute inset-0 rounded-[2rem] ${step.color} opacity-20 rotate-3 group-hover:rotate-6 transition-transform duration-500`} />
                  <div className={`absolute inset-0 rounded-[2rem] bg-white dark:bg-card border border-primary/5 dark:border-primary/10 flex items-center justify-center shadow-lg shadow-primary/5 group-hover:shadow-xl group-hover:shadow-accent/10 transition-all duration-500 z-10`}>
                    <step.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black border-4 border-white dark:border-card z-20 shadow-lg">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-2xl font-display font-black text-primary mb-4 italic group-hover:text-accent transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm text-primary/60 font-medium leading-relaxed px-2">
                  {step.description}
                </p>

                <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  <ArrowRight className="w-5 h-5 text-accent" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
