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
        {
            title: "Registration",
            status: "completed",
            date: journey?.registration_date ? new Date(journey.registration_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Verified"
        },
        {
            title: "Tuition Payment",
            status: tuitionStatus === 'Cleared' ? 'completed' : 'current',
            date: tuitionStatus === 'Cleared' ? "Verified" : "Pending"
        },
        {
            title: "Course Study",
            status: journey?.course_study_status === 'Completed' ? 'completed' : 'current',
            date: journey?.course_study_status || "In Progress"
        },
        {
            title: "Mock Exams",
            status: journey?.mock_exams_date ? 'completed' : progress > 40 ? 'current' : 'upcoming',
            date: journey?.mock_exams_date ? new Date(journey.mock_exams_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "TBD"
        },
        {
            title: "Ready for Exam",
            status: progress >= 100 ? 'completed' : progress > 80 ? 'current' : 'upcoming',
            date: journey?.target_exam_date ? new Date(journey.target_exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "TBD"
        },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-12">
            {/* Welcome Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[3rem] bg-primary p-12 lg:p-16 text-secondary shadow-2xl"
            >
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[140%] bg-white/10 rounded-full blur-[100px] -z-0" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[80%] bg-accent/20 rounded-full blur-[80px] -z-0 opacity-40" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <Badge className="bg-secondary/10 text-secondary border-none mb-10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic shadow-inner flex items-center gap-3 w-fit">
                            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            Elite Progress • ID: {user?.studentId || 'Pending'}
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-display font-black mb-8 leading-[1.05] italic">
                            Welcome back, <span className="text-accent">Scholar {user?.name}!</span>
                        </h1>
                        <p className="text-secondary/60 text-xl font-medium leading-relaxed mb-12 italic tracking-tight">
                            Your elite path to global success is <span className="text-white font-black">{progress}%</span> complete. Master the milestones and secure your target Band 8.5.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <Button className="bg-secondary hover:bg-white text-primary rounded-2xl px-10 h-16 font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/20 italic transition-all duration-500 hover:scale-105">
                                Start Elite Lesson
                            </Button>
                            <Button variant="outline" className="border-secondary/10 bg-white/5 hover:bg-white/10 text-white rounded-2xl px-10 h-16 font-black text-xs uppercase tracking-[0.2em] italic transition-all duration-500">
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
                                <div className="text-3xl font-black text-slate-900 dark:text-foreground mb-1">{stat.value}</div>
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.sub}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Timeline & Schedule */}
                <Card className="lg:col-span-2 rounded-[3rem] border border-white/40 shadow-2xl p-12 bg-white dark:bg-card">
                    <CardHeader className="px-0 pt-0 mb-10 flex flex-row items-center justify-between">
                        <CardTitle className="text-3xl font-display font-black italic text-primary tracking-tight">Journey Timeline</CardTitle>
                        <Button variant="ghost" className="text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 rounded-2xl px-6 h-10 italic">Full Archive</Button>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                            {journeyStages.map((stage, index) => (
                                <div key={index} className="relative flex items-start gap-8 group">
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border-4 border-white dark:border-card shadow-soft transition-all duration-300 z-10 shrink-0 ${stage.status === 'completed' ? "bg-primary text-white" :
                                        stage.status === 'current' ? "bg-primary text-secondary scale-110 shadow-lg shadow-primary/20" :
                                            "bg-slate-50 dark:bg-background text-slate-300 dark:text-muted-foreground"
                                        }`}>
                                        {stage.status === 'completed' ? (
                                            <CheckCircle2 className="w-6 h-6" />
                                        ) : stage.status === 'current' ? (
                                            <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                                        ) : (
                                            <Clock className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className="flex-grow pb-8 border-b border-slate-50 dark:border-border last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-black text-slate-900 dark:text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{stage.title}</h4>
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
                <div className="space-y-10">
                    <Card className="rounded-[3rem] border border-white/40 shadow-2xl p-12 bg-white dark:bg-card overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                        <CardHeader className="px-0 pt-0 mb-8 border-b border-primary/5 pb-6">
                            <CardTitle className="text-2xl font-display font-black italic text-primary tracking-tight">Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 space-y-4">
                            {[
                                { label: "Listening", score: "8.5", color: "primary" },
                                { label: "Reading", score: "7.5", color: "primary" },
                                { label: "Writing", score: "7.0", color: "primary" },
                                { label: "Speaking", score: "8.0", color: "primary" }
                            ].map((test) => (
                                <div key={test.label} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-background border border-slate-100 dark:border-border hover:border-primary/20 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-8 rounded-full bg-primary/20 group-hover:bg-primary transition-colors`} />
                                        <span className="font-bold text-slate-600 dark:text-foreground group-hover:text-primary">{test.label}</span>
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

                    <Card className="rounded-[2.5rem] border-none shadow-soft p-8 bg-gradient-to-br from-primary to-[#064e3b] text-secondary">
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
