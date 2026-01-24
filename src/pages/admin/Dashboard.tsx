import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  Trophy,
  TrendingUp,
  Clock,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Students", value: "...", icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "Loading" },
    { label: "Active Enrolments", value: "...", icon: GraduationCap, color: "text-primary", bg: "bg-indigo-50", trend: "Loading" },
    { label: "Tuition Cleared", value: "...", icon: CreditCard, color: "text-green-600", bg: "bg-green-50", trend: "Loading" },
    { label: "Avg. Readiness", value: "...", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", trend: "Loading" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      // 1. Total Students
      const { count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // 2. Journey Stats
      const { data: journeys } = await supabase
        .from('student_journeys')
        .select('tuition_status, readiness_percent');

      const clearedCount = journeys?.filter(j => j.tuition_status === 'Cleared').length || 0;
      const avgReadiness = journeys?.length
        ? Math.round(journeys.reduce((acc, curr) => acc + (curr.readiness_percent || 0), 0) / journeys.length)
        : 0;

      setStats([
        { label: "Total Students", value: (studentCount || 0).toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "Live" },
        { label: "Active Enrolments", value: (studentCount || 0).toString(), icon: GraduationCap, color: "text-primary", bg: "bg-indigo-50", trend: "Live" },
        { label: "Tuition Cleared", value: `${journeys?.length ? Math.round((clearedCount / journeys.length) * 100) : 0}%`, icon: CreditCard, color: "text-green-600", bg: "bg-green-50", trend: "Live" },
        { label: "Avg. Readiness", value: `${avgReadiness}%`, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", trend: "Live" },
      ]);
    };

    fetchStats();
  }, []);


  const recentActivities = [
    { id: "1", name: "Sarah Chen", activity: "Paid Tuition", amount: "KES 45,000", status: "Cleared", date: "2 mins ago", avatar: "SC" },
    { id: "2", name: "David Mwangi", activity: "Mock Test", amount: "Band 7.5", status: "Improved", date: "4 hours ago", avatar: "DM" },
    { id: "3", name: "Elena Rodriguez", activity: "Enrolment", amount: "Undergraduate", status: "New", date: "1 day ago", avatar: "ER" },
    { id: "4", name: "Ahmed Hassan", activity: "Missed Class", amount: "IELTS Speaking", status: "Alert", date: "2 days ago", avatar: "AH" },
    { id: "5", name: "Lin Zhao", activity: "Assignment", amount: "Task 2 Writing", status: "Submitted", date: "3 days ago", avatar: "LZ" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Reviewing": return <Badge className="bg-blue-50 text-blue-600 border-none px-2 py-0.5"><AlertCircle className="w-3 h-3 mr-1" /> Reviewing</Badge>;
      case "Accepted": return <Badge className="bg-green-50 text-green-600 border-none px-2 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1" /> Accepted</Badge>;
      case "Rejected": return <Badge className="bg-red-50 text-red-600 border-none px-2 py-0.5"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default: return <Badge className="bg-slate-50 text-slate-500 border-none px-2 py-0.5"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  return (
    <div className="space-y-12">

      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-bold text-primary font-display flex items-center gap-3">
          Good morning, <span className="text-secondary italic">ScholarPath Admin</span>
        </h2>
        <p className="text-slate-500 mt-1">Here's what's happening with scholarship applications today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-200/50 rounded-3xl group hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${s.bg} ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${s.trend.startsWith('+') ? 'text-green-600' : 'text-blue-600'}`}>
                  {s.trend} <TrendingUp className="w-3 h-3" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">{s.value}</div>
                <div className="text-sm font-medium text-slate-400">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Recent Activity Table */}
        <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-primary font-display">Recent Activity</CardTitle>
              <CardDescription>Track latest student journey milestones.</CardDescription>
            </div>
            <Link to="/admin/management">
              <Button variant="ghost" className="text-secondary font-bold hover:bg-gold-50">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  <tr>
                    <th className="px-8 py-4">Student</th>
                    <th className="px-8 py-4">Activity</th>
                    <th className="px-8 py-4">Level/Amount</th>
                    <th className="px-8 py-4">Time</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentActivities.map((act) => (
                    <tr key={act.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-bold font-sans">
                            {act.avatar}
                          </div>
                          <span className="font-bold text-primary text-sm">{act.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none font-bold text-[10px]">{act.activity}</Badge>
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-primary italic">{act.amount}</td>
                      <td className="px-8 py-5 text-xs text-slate-400 font-medium">{act.date}</td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 hover:bg-white rounded-lg shadow-sm text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Chart Static Placeholders */}
        <div className="space-y-8">
          <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] p-8 bg-primary text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 blur-[60px] rounded-full" />
            <h3 className="text-xl font-bold font-display mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4">
              <Button className="w-full bg-white/10 hover:bg-white/20 border-white/5 h-14 justify-start gap-4 rounded-2xl group transition-all">
                <div className="p-2 bg-secondary rounded-xl group-hover:scale-110 transition-transform"><GraduationCap className="w-4 h-4 text-primary" /></div>
                New Scholarship
              </Button>
              <Button className="w-full bg-white/10 hover:bg-white/20 border-white/5 h-14 justify-start gap-4 rounded-2xl group transition-all">
                <div className="p-2 bg-blue-400 rounded-xl group-hover:scale-110 transition-transform"><Users className="w-4 h-4 text-white" /></div>
                Manage Users
              </Button>
              <Button className="w-full bg-white/10 hover:bg-white/20 border-white/5 h-14 justify-start gap-4 rounded-2xl group transition-all">
                <div className="p-2 bg-green-400 rounded-xl group-hover:scale-110 transition-transform"><ArrowUpRight className="w-4 h-4 text-white" /></div>
                Export Reports
              </Button>
            </div>
          </Card>

          <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] p-8">
            <h3 className="text-xl font-bold text-primary mb-2 font-display">System Health</h3>
            <div className="flex items-center gap-2 mb-6 text-green-600 font-bold text-xs uppercase tracking-widest">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              All Systems Operational
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                <span className="text-sm text-slate-500">DB Persistence</span>
                <span className="text-sm font-bold text-primary">Active</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                <span className="text-sm text-slate-500">Auth Service</span>
                <span className="text-sm font-bold text-primary">Healthy</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-slate-500">File Storage</span>
                <span className="text-sm font-bold text-primary">92% Free</span>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
