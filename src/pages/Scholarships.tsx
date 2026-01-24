import { useState, useEffect } from "react";
import { ScholarshipCard } from "@/components/landing/ScholarshipCard";
import { ScholarshipCategory } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, BookOpen, GraduationCap, Globe, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";

export default function Scholarships() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<ScholarshipCategory | 'All'>('All');
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScholarships = async () => {
            let query = supabase.from('scholarships').select('*');

            if (activeCategory !== 'All') {
                query = query.eq('category', activeCategory);
            }

            if (search) {
                query = query.or(`title.ilike.%${search}%,university.ilike.%${search}%`);
            }

            const { data } = await query;
            if (data) setScholarships(data);
            setLoading(false);
        };

        const timer = setTimeout(() => {
            fetchScholarships();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, activeCategory]);

    const filtered = scholarships;

    const categories: (ScholarshipCategory | 'All')[] = ['All', 'Undergraduate', 'Masters', 'PhD', 'Vocational'];

    return (
        <div className="bg-white min-h-screen">
            {/* Search Header */}
            <div className="bg-primary pt-32 pb-20 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 italic">Scholarship Directory</h1>
                        <p className="text-primary-foreground/70 text-lg">
                            Explore {scholarships.length}+ verified opportunities from elite institutions worldwide.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-secondary transition-colors" />
                        <Input
                            placeholder="Search by university, country, or course..."
                            className="w-full h-16 pl-16 pr-6 py-4 rounded-full bg-white text-primary text-xl border-none shadow-2xl focus-visible:ring-secondary/50"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Sidebar Filters */}
                    <aside className="lg:w-1/4 space-y-10">
                        <div>
                            <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-secondary" /> Categories
                            </h3>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium flex justify-between items-center ${activeCategory === cat
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'hover:bg-slate-50 text-slate-600'
                                            }`}
                                    >
                                        {cat}
                                        {activeCategory === cat && <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-white">Active</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-secondary/5 rounded-3xl border border-secondary/10 relative overflow-hidden group">
                            <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                                <GraduationCap className="w-40 h-40 text-secondary" />
                            </div>
                            <h4 className="text-primary font-bold mb-3">Expert Guidance</h4>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                Confused about which scholarship fits you? Talk to our education consultants.
                            </p>
                            <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl">Book Consultation</Button>
                        </div>
                    </aside>

                    {/* Main Results */}
                    <div className="lg:w-3/4">
                        <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-6">
                            <div className="text-slate-500 font-medium">
                                Showing <span className="text-primary font-bold">{filtered.length}</span> results
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="border-slate-200 text-slate-500 gap-1 px-3 py-1.5">
                                    <Clock className="w-3 h-3" /> Recent
                                </Badge>
                                <Badge variant="outline" className="border-slate-200 text-slate-500 gap-1 px-3 py-1.5">
                                    <Globe className="w-3 h-3" /> Global
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                            {filtered.map(s => (
                                <ScholarshipCard key={s.id} scholarship={s} />
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <div className="p-6 bg-white rounded-full inline-block mb-6 shadow-sm">
                                    <BookOpen className="w-12 h-12 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-primary mb-2">No matching scholarships</h3>
                                <p className="text-slate-500">Try broadening your filters or searching for something else.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
