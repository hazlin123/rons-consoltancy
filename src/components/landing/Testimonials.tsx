import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Oxford University Scholar",
    content: "ScholarPath transformed my application process. Their guidance on the personal statement was invaluable, and I successfully secured full funding for my Masters.",
    avatar: "SC",
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "David Mwangi",
    role: "MIT Undergraduate Student",
    content: "Coming from Kenya, I wasn't sure how to approach US Ivy League applications. The mentorship here is top-notch. I'm now halfway through my CS degree at MIT!",
    avatar: "DM",
    image: "https://i.pravatar.cc/150?u=david"
  },
  {
    name: "Elena Rodriguez",
    role: "Toronto PhD Candidate",
    content: "The level of detail in their scholarship database is unmatched. I found niche grants I would have never discovered on my own. Highly recommended.",
    avatar: "ER",
    image: "https://i.pravatar.cc/150?u=elena"
  }
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[120%] bg-primary/5 rounded-bl-[400px] -z-10 blur-3xl opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground">Student <span className="text-primary italic">Success</span> Stories</h2>
          <p className="text-muted-foreground text-lg font-medium">
            Join thousands of successful students who achieved their dreams through our portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 relative group hover:shadow-hover transition-all duration-300"
            >
              <Quote className="absolute top-6 right-8 w-12 h-12 text-primary/5 group-hover:text-primary/10 transition-colors" />

              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-foreground mb-8 font-medium leading-relaxed italic text-lg">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                <Avatar className="h-14 w-14 border-2 border-primary/20">
                  <AvatarImage src={t.image} />
                  <AvatarFallback className="bg-primary text-white font-bold">{t.avatar}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-black text-foreground">{t.name}</div>
                  <div className="text-xs font-bold text-primary uppercase tracking-wider">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
