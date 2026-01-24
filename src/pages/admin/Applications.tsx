import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Mail,
  Calendar,
  User,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminApplications() {
  const [search, setSearch] = useState("");

  const applications = [
    { id: "1", name: "Sarah Chen", scholarship: "Oxford Global Excellence", status: "Reviewing", date: "2024-03-24", email: "sarah.c@example.com", avatar: "SC" },
    { id: "2", name: "David Mwangi", scholarship: "MIT Tech Grant", status: "Accepted", date: "2024-03-23", email: "david.m@example.com", avatar: "DM" },
    { id: "3", name: "Elena Rodriguez", scholarship: "Vanier Canada PhD", status: "Pending", date: "2024-03-22", email: "elena.r@example.com", avatar: "ER" },
    { id: "4", name: "Ahmed Hassan", scholarship: "Oxford Global Excellence", status: "Rejected", date: "2024-03-21", email: "ahmed.h@example.com", avatar: "AH" },
    { id: "5", name: "Lin Zhao", scholarship: "Commonwealth Shared", status: "Reviewing", date: "2024-03-20", email: "lin.z@example.com", avatar: "LZ" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Reviewing": return <Badge className="bg-blue-50 text-blue-600 border-none px-3 py-1 font-bold text-[10px] uppercase"><AlertCircle className="w-3 h-3 mr-1" /> Reviewing</Badge>;
      case "Accepted": return <Badge className="bg-green-50 text-green-600 border-none px-3 py-1 font-bold text-[10px] uppercase"><CheckCircle2 className="w-3 h-3 mr-1" /> Accepted</Badge>;
      case "Rejected": return <Badge className="bg-red-50 text-red-600 border-none px-3 py-1 font-bold text-[10px] uppercase"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default: return <Badge className="bg-slate-50 text-slate-500 border-none px-3 py-1 font-bold text-[10px] uppercase"><Calendar className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  const filtered = applications.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.scholarship.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
        <div>
          <h2 className="text-3xl font-bold text-primary font-display italic">Student Applications</h2>
          <p className="text-slate-500">Track and manage scholarship applications from students globally.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-200 font-bold gap-2 text-slate-600">
            <Filter className="w-4 h-4" /> Filters
          </Button>
          <Button className="h-14 px-8 bg-primary hover:bg-primary/95 font-bold rounded-2xl shadow-xl shadow-primary/20 gap-2">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by student name, scholarship or email..."
            className="h-12 pl-12 border-none bg-slate-50/50 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/40 overflow-hidden border border-slate-100 font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Applicant Details</th>
                <th className="px-8 py-5">Scholarship</th>
                <th className="px-8 py-5">Date Submitted</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((app) => (
                <tr key={app.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white text-xs font-bold ring-4 ring-slate-50 shadow-md">
                        {app.avatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-primary mb-0.5 group-hover:text-secondary transition-colors">{app.name}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {app.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{app.scholarship}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verified Opportunity</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-medium text-slate-600 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-300" />
                      {new Date(app.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-5">{getStatusBadge(app.status)}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-primary"><FileText className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-secondary"><ExternalLink className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-primary"><MoreVertical className="w-4 h-4" /></Button>
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
          <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-primary font-bold">No applications found</h3>
          <p className="text-slate-500 text-sm">Try a different search term or filter.</p>
        </div>
      )}
    </div>
  );
}
