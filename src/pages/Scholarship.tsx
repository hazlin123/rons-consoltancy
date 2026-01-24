import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, GraduationCap, ArrowLeft, Trophy, Users, Globe, CheckCircle2, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import NotFound from "./NotFound";
import { supabase } from "@/lib/supabaseClient";

export default function Scholarship() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarship = async () => {
      const { data } = await supabase
        .from('scholarships')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setScholarship(data);
      setLoading(false);
    };

    fetchScholarship();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!scholarship) return <NotFound />;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="bg-slate-50 border-b border-slate-100 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/scholarships" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-12 transition-colors">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to directory
          </Link>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-secondary/10 text-secondary border-none px-4 py-1 uppercase tracking-widest font-bold">
                  {scholarship.category}
                </Badge>
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <MapPin className="w-4 h-4" /> {scholarship.university}, {scholarship.country}
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-primary mb-8 font-display italic">
                {scholarship.title}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Funding</div>
                  <div className="text-primary font-bold text-lg">{scholarship.amount}</div>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Deadline</div>
                  <div className="text-primary font-bold text-lg">{new Date(scholarship.deadline).toLocaleDateString()}</div>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Capacity</div>
                  <div className="text-primary font-bold text-lg">{scholarship.slots} Slots</div>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Nationality</div>
                  <div className="text-primary font-bold text-lg">Global</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col gap-4">
              <a href="#contact" className="w-full">
                <Button size="lg" className="w-full h-16 px-12 bg-primary hover:bg-primary/95 text-xl font-black rounded-2xl shadow-2xl shadow-primary/20 italic">
                  Inquire Now
                </Button>
              </a>
              <Button variant="outline" className="h-14 rounded-2xl border-slate-200 gap-2 font-black italic">
                <Share2 className="w-4 h-4" /> Share Opportunity
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-20">

          {/* Information Column */}
          <div className="lg:w-full space-y-16">
            <section>
              <h2 className="text-3xl font-bold text-primary mb-8 font-display flex items-center gap-4 italic">
                <Trophy className="w-8 h-8 text-secondary" /> Opportunity Overview
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-4xl">
                {scholarship.description} This scholarship is designed to support the brightest minds in pursuing their academic excellence at {scholarship.university}. We are looking for candidates who demonstrate exceptional leadership and academic achievements.
              </p>
            </section>

            {/* Contact CTA Area */}
            <section className="bg-slate-50 border border-slate-100 p-12 rounded-[3.5rem] text-center">
              <h3 className="text-3xl font-black text-foreground mb-4">Interested in this Opportunity?</h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto font-medium text-lg">
                Visit our office or contact us directly to begin your journey. Our experts will provide you with a unique portal access link upon registration.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#contact">
                  <Button size="xl" className="rounded-2xl h-16 px-10 bg-primary text-white font-black italic shadow-soft">
                    Talk to an Expert
                  </Button>
                </a>
              </div>
            </section>

            <section className="bg-slate-900 text-white p-12 rounded-[3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px]" />
              <h2 className="text-3xl font-bold mb-10 font-display italic">Eligibility Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {scholarship.requirements.map((req, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-2xl hover:bg-white/5 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                    <div className="text-lg">{req}</div>
                  </div>
                ))}
                <div className="flex gap-4 items-start p-4 rounded-2xl hover:bg-white/5 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                  <div className="text-lg">Full-time enrollment required</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-primary mb-8 font-display flex items-center gap-4 italic">
                <Users className="w-8 h-8 text-secondary" /> Why Choose {scholarship.university}?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 border border-slate-100 rounded-3xl bg-slate-50/30">
                  <Globe className="w-10 h-10 text-primary mb-4" />
                  <h4 className="font-bold text-xl mb-2">Global Standing</h4>
                  <p className="text-slate-500">Ranked consistently among the top universities worldwide with a vibrant international community.</p>
                </div>
                <div className="p-8 border border-slate-100 rounded-3xl bg-slate-50/30">
                  <GraduationCap className="w-10 h-10 text-primary mb-4" />
                  <h4 className="font-bold text-xl mb-2">Career Outlook</h4>
                  <p className="text-slate-500">Exceptional graduate outcomes and strong industry partnerships for research and internships.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
