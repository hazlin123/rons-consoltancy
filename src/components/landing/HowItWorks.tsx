import { Search, FileText, Send, UserCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Scholarships",
    description: "Explore our curated list of global opportunities tailored to your academic background and goals.",
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    icon: FileText,
    title: "Preparation",
    description: "Get comprehensive guidance on document preparation, including personal statements and IELTS requirements.",
    color: "bg-orange-50 text-orange-600"
  },
  {
    icon: Send,
    title: "Fast Application",
    description: "Apply directly through our portal with streamlined processes and real-time status tracking.",
    color: "bg-teal-50 text-teal-600"
  },
  {
    icon: UserCheck,
    title: "Expert Review",
    description: "Our council experts review your application to maximize your chances of success.",
    color: "bg-purple-50 text-purple-600"
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">Your Path to <span className="text-primary italic">Success</span></h2>
          <p className="text-muted-foreground text-lg font-medium">
            We simplify the complex scholarship application process into four clear steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-slate-50 -z-10" />
              )}

              <div className="flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-3xl ${step.color} flex items-center justify-center mb-8 shadow-soft group-hover:shadow-hover group-hover:-translate-y-1 transition-all duration-300`}>
                  <step.icon className="w-10 h-10" />
                </div>
                <div className="absolute -top-2 -left-2 w-10 h-10 rounded-2xl bg-white shadow-soft border border-slate-100 flex items-center justify-center text-sm font-black text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4">{step.title}</h3>
                <p className="text-base text-muted-foreground font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
