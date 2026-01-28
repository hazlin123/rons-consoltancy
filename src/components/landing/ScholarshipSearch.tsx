import { useState, useEffect } from "react";
import { Search, Globe2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScholarshipCard } from "./ScholarshipCard";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export const ScholarshipSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [country, setCountry] = useState("Worldwide");
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      let query = supabase.from('scholarships').select('*');

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,university.ilike.%${searchQuery}%`);
      }

      if (category !== "All Categories") {
        query = query.eq('category', category);
      }

      if (country !== "Worldwide") {
        query = query.eq('country', country);
      }

      const { data } = await query;
      if (data) setScholarships(data);
      setLoading(false);
    };

    const timer = setTimeout(() => {
      fetchScholarships();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, category, country]);

  const filteredScholarships = scholarships;

  return (
    <section id="scholarships" className="py-32 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-[-20%] w-[60%] h-[80%] bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[40%] h-[60%] bg-gradient-to-tl from-primary/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <h2 className="text-5xl md:text-7xl font-display font-black text-primary mb-8 leading-[0.95]">
              Find Your <br className="hidden md:block" />
              <span className="italic text-accent">Perfect Scholarship</span>
            </h2>
            <p className="text-xl text-primary/50 leading-relaxed max-w-2xl mx-auto">
              Access verified funding opportunities from world-class universities.
              Your journey to global education starts with one search.
            </p>
          </motion.div>
        </div>

        {/* Search Bar - Travel Booking Style */}
        <div className="max-w-5xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel rounded-[2.5rem] p-3 shadow-soft border border-white/40 dark:border-white/10 flex flex-col md:flex-row items-stretch md:items-center gap-2 group transition-all duration-500 hover:shadow-hover dark:bg-card/50"
          >
            {/* Search Input */}
            <div className="flex-grow flex items-center px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100">
              <Search className="w-5 h-5 text-primary mr-3 shrink-0" />
              <div className="flex flex-col flex-grow">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Where to Study?</label>
                <input
                  type="text"
                  placeholder="University or course..."
                  className="bg-transparent border-none focus:outline-none text-foreground font-semibold placeholder:text-muted-foreground/50 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Select (Simulated) */}
            <div className="px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100 min-w-[180px]">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Degree Level</label>
                <select
                  className="bg-transparent border-none focus:outline-none text-foreground font-semibold appearance-none cursor-pointer pr-4"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>All Categories</option>
                  <option>Undergraduate</option>
                  <option>Masters</option>
                  <option>PhD</option>
                </select>
              </div>
            </div>

            {/* Country Select (Simulated) */}
            <div className="px-6 py-3 min-w-[180px]">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Destination</label>
                <select
                  className="bg-transparent border-none focus:outline-none text-foreground font-semibold appearance-none cursor-pointer pr-4"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option>Worldwide</option>
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Australia</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <Button size="icon" className="h-14 w-14 md:h-18 md:w-18 rounded-2xl md:rounded-[1.5rem] bg-primary text-white shrink-0 shadow-2xl shadow-primary/20 hover:scale-105 transition-all active:scale-95">
              <Search className="w-6 h-6 md:w-7 md:h-7" />
            </Button>
          </motion.div>
        </div>

        {/* Results Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {filteredScholarships.map((scholarship, index) => (
            <motion.div
              key={scholarship.id}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 100, damping: 20 }
                }
              }}
            >
              <ScholarshipCard scholarship={scholarship} />
            </motion.div>
          ))}
        </motion.div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-card rounded-3xl border border-dashed border-gray-200 dark:border-border">
            <Search className="w-16 h-16 mx-auto text-gray-200 mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">No scholarships found</h3>
            <p className="text-muted-foreground">Try adjusting your destinations or filters.</p>
          </div>
        )}

        {/* See More */}
        <div className="mt-20 text-center">
          <a href="#contact">
            <Button variant="ghost" className="h-14 px-8 rounded-2xl font-bold gap-2 hover:bg-primary/5 group">
              Inquire About Full Directory <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
