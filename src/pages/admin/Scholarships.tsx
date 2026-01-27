import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Scholarship } from "@/types";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Filter,
  MoreVertical,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

export default function AdminScholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchScholarships = async () => {
    const { data } = await supabase
      .from('scholarships')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setScholarships(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this scholarship? This action cannot be undone.")) {
      const { error } = await supabase
        .from('scholarships')
        .delete()
        .eq('id', id);

      if (!error) {
        toast.success("Scholarship deleted successfully");
        fetchScholarships();
      } else {
        toast.error("Failed to delete scholarship");
      }
    }
  };

  const filtered = scholarships.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.university.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary font-display italic">Scholarship Management</h2>
          <p className="text-slate-500">Create, edit and manage global scholarship opportunities.</p>
        </div>
        <Link to="/admin/scholarships/new">
          <Button className="h-14 px-8 bg-primary hover:bg-primary/95 font-bold rounded-2xl shadow-xl shadow-primary/20 gap-2">
            <Plus className="w-5 h-5" /> New Scholarship
          </Button>
        </Link>
      </div>

      {/* Control Bar */}
      <CardSlim>
        <div className="flex flex-col md:flex-row justify-between gap-4 p-4">
          <div className="relative flex-grow max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search scholarships..."
              className="pl-12 h-12 bg-slate-50/50 border-none rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 border-slate-200 rounded-xl gap-2 font-bold text-slate-600">
              <Filter className="w-4 h-4" /> Filters
            </Button>
            <Button variant="outline" className="h-12 border-slate-200 rounded-xl font-bold text-slate-600">
              Export
            </Button>
          </div>
        </div>
      </CardSlim>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/40 overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Title & Institution</th>
                <th className="px-8 py-5">Country</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Deadline</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((s) => (
                <tr key={s.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary mb-0.5 group-hover:text-secondary transition-colors">{s.title}</span>
                      <span className="text-xs text-slate-400 font-medium italic">{s.university}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {s.countryCode && (
                        <img src={`https://flagcdn.com/w20/${s.countryCode.toLowerCase()}.png`} className="w-4 h-3 rounded-sm opacity-60" alt="" />
                      )}
                      <span className="text-sm font-medium text-slate-600">{s.country}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-none font-bold text-[10px] uppercase">
                      {s.category}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-700 text-sm">{s.amount}</td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-medium text-slate-600">{new Date(s.deadline).toLocaleDateString()}</div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <Link to={`/scholarships/${s.id}`} target="_blank">
                        <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-400 hover:text-primary"><ExternalLink className="w-4 h-4" /></Button>
                      </Link>
                      <Link to={`/admin/scholarships/${s.id}/edit`}>
                        <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-400 hover:text-secondary transition-colors"><Edit3 className="w-4 h-4" /></Button>
                      </Link>
                      <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-400 hover:text-red-500" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-primary font-bold">No scholarships found</h3>
          <p className="text-slate-500 text-sm">Create a new scholarship or adjust your search.</p>
        </div>
      )}
    </div>
  );
}

const CardSlim = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    {children}
  </div>
);
