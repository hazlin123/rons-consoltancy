import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    Clock,
    Calendar,
    BookOpen,
    Trophy,
    TrendingUp,
    CreditCard
} from "lucide-react";
import { motion } from "framer-motion";

import { useToast } from "@/components/ui/use-toast";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

const StudentDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [journey, setJourney] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchJourney = async () => {
            const { data, error } = await supabase
                .from('student_journeys')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (data) {
                setJourney(data);
            }
            setLoading(false);
        };

        fetchJourney();

        const channel = supabase
            .channel(`journey-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'student_journeys',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    setJourney(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const handleMockTest = () => {
        toast({
            title: "Mock Test Scheduled",
            description: "Your session has been prepared. Please wait for the examiner.",
            variant: "default",
        });
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const progress = journey?.readiness_percent || 0;
    const attendanceRate = journey?.attendance_rate || 0;
    const pendingAssignments = journey?.pending_assignments || 0;
    const lastMockScore = journey?.last_mock_score || "N/A";
    const tuitionStatus = journey?.tuition_status || "Pending";

    const journeyStages = [
        { title: "Registration", status: "completed", date: "Jan 10, 2024" },
        { title: "Tuition Payment", status: tuitionStatus === 'Cleared' ? 'completed' : 'current', date: "Verified" },
        { title: "Course Study", status: "current", date: "In Progress" },
        { title: "Mock Exams", status: progress > 50 ? "current" : "upcoming", date: "Feb 15, 2024" },
        { title: "Ready for Exam", status: progress > 90 ? "current" : "upcoming", date: journey?.target_exam_date || "TBD" },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-12">
            {/* Welcome Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-primary p-12 text-secondary shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent -z-0" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <Badge className="bg-secondary/20 text-secondary border-secondary/20 mb-6 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                            Academic Progress
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1]">
                            Welcome back, <span className="text-secondary italic">{user?.name}!</span>
                        </h1>
                        <p className="text-secondary/80 text-lg font-medium leading-relaxed mb-8">
                            You're doing great! Your path to success is <span className="text-white font-bold">{progress}%</span> complete. Keep pushing towards your target band 8.0!
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button className="bg-secondary hover:bg-white text-primary rounded-2xl px-8 h-14 font-black text-lg shadow-lg shadow-black/10">
                                Continue Lesson
                            </Button>
                            <Button variant="outline" className="border-secondary/20 bg-white/5 hover:bg-white/10 text-white rounded-2xl px-8 h-14 font-black text-lg">
                                View Schedule
                            </Button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-[12px] border-white/10 flex items-center justify-center relative">
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="45%"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray="100 100"
                                    strokeDashoffset={100 - progress}
                                    className="text-secondary transition-all duration-1000 ease-out"
                                    pathLength="100"
                                />
                            </svg>
                            <div className="text-center">
                                <div className="text-4xl md:text-6xl font-black text-secondary">{progress}%</div>
                                <div className="text-[10px] uppercase tracking-widest font-bold text-secondary/50">Readiness</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Attendance", value: `${attendanceRate}%`, icon: Calendar, color: "primary", sub: "Perfect Presence" },
                    { label: "Pending Tasks", value: pendingAssignments, icon: BookOpen, color: "primary", sub: "Assignments" },
                    { label: "Mock Result", value: lastMockScore, icon: Trophy, color: "primary", sub: "Latest AVG" },
                    { label: "Tuition", value: tuitionStatus, icon: CreditCard, color: "primary", sub: "Payment Status" }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="rounded-[2rem] border-none shadow-soft hover:shadow-hover transition-all duration-300 group overflow-hidden">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`p-4 rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform shadow-sm`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div className="w-12 h-1 bg-primary/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-2/3 shadow-[0_0_10px_rgba(127,29,29,0.3)]" />
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.sub}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Timeline & Schedule */}
                <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-soft p-10 bg-white">
                    <CardHeader className="px-0 pt-0 mb-8 flex flex-row items-center justify-between">
                        <CardTitle className="text-2xl font-black italic text-primary">Journey Timeline</CardTitle>
                        <Button variant="ghost" className="text-primary font-bold text-sm hover:bg-primary/5 rounded-xl">View Full History</Button>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                            {journeyStages.map((stage, index) => (
                                <div key={index} className="relative flex items-start gap-8 group">
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border-4 border-white shadow-soft transition-all duration-300 z-10 shrink-0 ${stage.status === 'completed' ? "bg-primary text-white" :
                                            stage.status === 'current' ? "bg-primary text-secondary scale-110 shadow-lg shadow-primary/20" :
                                                "bg-slate-50 text-slate-300"
                                        }`}>
                                        {stage.status === 'completed' ? (
                                            <CheckCircle2 className="w-6 h-6" />
                                        ) : stage.status === 'current' ? (
                                            <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                                        ) : (
                                            <Clock className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className="flex-grow pb-8 border-b border-slate-50 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-black text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight">{stage.title}</h4>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">{stage.date}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 font-medium italic">Official milestone for your IELTS success program.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Analytics Sidebar */}
                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] border-none shadow-soft p-10 bg-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <CardHeader className="px-0 pt-0 mb-6 border-b border-primary/5 pb-4">
                            <CardTitle className="text-xl font-black italic text-primary">Test Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 space-y-4">
                            {[
                                { label: "Listening", score: "8.5", color: "primary" },
                                { label: "Reading", score: "7.5", color: "primary" },
                                { label: "Writing", score: "7.0", color: "primary" },
                                { label: "Speaking", score: "8.0", color: "primary" }
                            ].map((test) => (
                                <div key={test.label} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-8 rounded-full bg-primary/20 group-hover:bg-primary transition-colors`} />
                                        <span className="font-bold text-slate-600 group-hover:text-primary">{test.label}</span>
                                    </div>
                                    <span className="text-lg font-black text-primary">{test.score}</span>
                                </div>
                            ))}
                            <Button
                                onClick={handleMockTest}
                                className="w-full mt-6 bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 font-black shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Practice Test
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-soft p-8 bg-gradient-to-br from-primary to-[#511111] text-secondary">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-sm">
                                <TrendingUp className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest text-secondary/60">Expert Tip</div>
                                <div className="font-black text-white">Focus on Lexical Resource</div>
                            </div>
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-secondary/80 italic">
                            Improving your vocabulary variety can push your Writing and Speaking scores from 7.0 to 8.5!
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
