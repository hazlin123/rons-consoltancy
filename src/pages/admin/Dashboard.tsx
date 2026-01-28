import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const [stats, setStats] = useState([
    { label: "Total Students", value: "...", icon: Users, color: "text-primary", bg: "bg-primary/10", trend: "Loading" },
    { label: "Active Enrolments", value: "...", icon: GraduationCap, color: "text-primary", bg: "bg-primary/5", trend: "Loading" },
    { label: "Tuition Cleared", value: "...", icon: CreditCard, color: "text-green-600", bg: "bg-green-50", trend: "Loading" },
    { label: "Avg. Readiness", value: "...", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", trend: "Loading" },
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
        { label: "Total Students", value: (studentCount || 0).toString(), icon: Users, color: "text-primary", bg: "bg-primary/10", trend: "Live" },
        { label: "Active Enrolments", value: (studentCount || 0).toString(), icon: GraduationCap, color: "text-primary", bg: "bg-primary/5", trend: "Live" },
        { label: "Tuition Cleared", value: `${journeys?.length ? Math.round((clearedCount / journeys.length) * 100) : 0}%`, icon: CreditCard, color: "text-green-600", bg: "bg-green-50", trend: "Live" },
        { label: "Avg. Readiness", value: `${avgReadiness}%`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", trend: "Live" },
      ]);
    };

    fetchStats();
  }, []);


  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      const { data: apps } = await supabase
        .from('scholarship_applications')
        .select(`
          id,
          status,
          created_at,
          profiles (name),
          scholarships (title)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (apps) {
        setRecentActivities(apps.map((app: any) => ({
          id: app.id,
          name: app.profiles?.name || 'Unknown',
          activity: "Scholarship App",
          amount: app.scholarships?.title || 'N/A',
          status: app.status,
          date: new Date(app.created_at).toLocaleDateString(),
          avatar: (app.profiles?.name || 'U').charAt(0)
        })));
      }
    };

    fetchRecentActivities();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Reviewing": return <Badge className="bg-primary/5 text-primary border-none px-2 py-0.5"><AlertCircle className="w-3 h-3 mr-1" /> Reviewing</Badge>;
      case "Accepted": return <Badge className="bg-green-50 text-green-600 border-none px-2 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1" /> Accepted</Badge>;
      case "Rejected": return <Badge className="bg-red-50 text-red-600 border-none px-2 py-0.5"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default: return <Badge className="bg-slate-50 text-slate-500 border-none px-2 py-0.5"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  const handleExport = async () => {
    toast({ title: "Export Started", description: "Compiling system data..." });

    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, name, email, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!users || users.length === 0) {
        toast({ title: "No Data", description: "No records found to export.", variant: "default" });
        return;
      }

      // Convert to CSV
      const headers = ["ID", "Name", "Email", "Role", "Created At"];
      const csvRows = [headers.join(",")];

      users.forEach(user => {
        const values = [
          user.id,
          `"${(user.name || '').replace(/"/g, '""')}"`,
          `"${(user.email || '').replace(/"/g, '""')}"`,
          user.role,
          user.created_at
        ];
        csvRows.push(values.join(","));
      });

      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `scholarpath_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: "Export Complete", description: `Successfully exported ${users.length} records.`, variant: "default" }); // Success variant usually default or distinct
    } catch (error: any) {
      console.error("Export error:", error);
      toast({ title: "Export Failed", description: error.message || "Failed to generate report.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-foreground">
            {greeting}, {user?.name?.split(' ')[0] || 'Admin'}!
          </h1>
          <p className="text-slate-500 dark:text-muted-foreground mt-2">Here's what's happening in your academy today.</p>
        </div>
        <div className="hidden md:block">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-muted text-slate-600 dark:text-foreground">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-xl shadow-slate-200/60 dark:shadow-none hover:shadow-2xl hover:shadow-slate-200/40 dark:hover:shadow-none transition-all duration-300 group overflow-hidden relative dark:bg-card">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${stat.color}`}>
              <stat.icon className="w-24 h-24" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-slate-900 dark:text-foreground mb-1 tracking-tight">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.trend === 'Live' ? (
                  <span className="text-emerald-600 flex items-center font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" /> Live
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> Updating
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl shadow-slate-200/60 dark:shadow-none dark:bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold font-display">Recent Applications</CardTitle>
                <CardDescription>Latest scholarship requests from students</CardDescription>
              </div>
              <Link to="/admin/scholarships">
                <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                  View All <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length > 0 ? recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between group p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-bold text-lg shadow-inner">
                        {activity.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-foreground group-hover:text-primary transition-colors">{activity.name}</p>
                        <p className="text-xs text-slate-500 dark:text-muted-foreground">{activity.amount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(activity.status)}
                      <span className="text-xs text-slate-400 w-20 text-right font-medium">{activity.date}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 text-slate-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] p-8 bg-primary text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 blur-[60px] rounded-full" />
            <h3 className="text-xl font-bold font-display mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4">
              <Link to="/admin/scholarships/new" className="block w-full">
                <Button className="w-full bg-white/10 hover:bg-white/20 border-white/5 h-14 justify-start gap-4 rounded-2xl group transition-all">
                  <div className="p-2 bg-secondary rounded-xl group-hover:scale-110 transition-transform"><GraduationCap className="w-4 h-4 text-primary" /></div>
                  New Scholarship
                </Button>
              </Link>
              <Link to="/admin/management" className="block w-full">
                <Button className="w-full bg-white/10 hover:bg-white/20 border-white/5 h-14 justify-start gap-4 rounded-2xl group transition-all">
                  <div className="p-2 bg-blue-400 rounded-xl group-hover:scale-110 transition-transform"><Users className="w-4 h-4 text-white" /></div>
                  Manage Users
                </Button>
              </Link>
              <Button onClick={handleExport} className="w-full bg-white/10 hover:bg-white/20 border-white/5 h-14 justify-start gap-4 rounded-2xl group transition-all">
                <div className="p-2 bg-green-400 rounded-xl group-hover:scale-110 transition-transform"><ArrowUpRight className="w-4 h-4 text-white" /></div>
                Export Reports
              </Button>
            </div>
          </Card>

          <Card className="border-none shadow-2xl shadow-slate-200/40 dark:shadow-none rounded-[2.5rem] p-8 dark:bg-card">
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
