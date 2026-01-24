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
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-foreground mb-2 italic">Welcome back, {user?.name}!</h1>
                <p className="text-muted-foreground font-medium">Your IELTS journey is <span className="text-primary font-bold">{progress}%</span> complete.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="rounded-2xl border-none shadow-soft overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-none">Attendance</Badge>
                        </div>
                        <div className="text-3xl font-black text-foreground mb-1">{attendanceRate}%</div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Perfect Attendance</p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-soft overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-orange-50 rounded-xl text-orange-600 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-none">Tasks</Badge>
                        </div>
                        <div className="text-3xl font-black text-foreground mb-1">{pendingAssignments}</div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Pending Assignments</p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-soft overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-teal-50 rounded-xl text-teal-600 group-hover:scale-110 transition-transform">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-none">Latest Score</Badge>
                        </div>
                        <div className="text-3xl font-black text-foreground mb-1">{lastMockScore}</div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Mock Result (AVG)</p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-soft overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-green-50 rounded-xl text-green-600 group-hover:scale-110 transition-transform">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <Badge variant="secondary" className="bg-green-50 text-green-700 border-none">Payment</Badge>
                        </div>
                        <div className="text-xl font-black text-foreground mb-1 italic uppercase">{tuitionStatus}</div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Tuition Status</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Timeline */}
                <Card className="lg:col-span-2 rounded-[2rem] border-none shadow-soft p-8">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-2xl font-black italic">Journey Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-100 before:to-transparent">
                            {journeyStages.map((stage, index) => (
                                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow-soft group-hover:scale-110 transition-transform z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        {stage.status === 'completed' ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                                        ) : stage.status === 'current' ? (
                                            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                                        ) : (
                                            <Clock className="w-5 h-5 text-slate-300" />
                                        )}
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-soft transition-all">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-black text-foreground">{stage.title}</div>
                                            <time className="text-[10px] uppercase font-bold text-primary">{stage.date}</time>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Score Analytics */}
                <Card className="rounded-[2rem] border-none shadow-soft p-8 bg-primary text-white">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-2xl font-black italic">IELTS Readiness</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 space-y-6">
                        <div className="text-center py-6">
                            <div className="inline-flex relative items-center justify-center">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-white/10"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={364.42}
                                        strokeDashoffset={364.42 - (progress / 100) * 364.42}
                                        className="text-secondary"
                                    />
                                </svg>
                                <span className="absolute text-3xl font-black">{progress}%</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-secondary" />
                                    <span className="font-bold text-sm">Target Band</span>
                                </div>
                                <span className="text-xl font-black">8.0</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-secondary" />
                                    <span className="font-bold text-sm">Study Days</span>
                                </div>
                                <span className="text-xl font-black">{journey?.study_days_count || 0}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleMockTest}
                            className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl h-14 font-black text-lg"
                        >
                            Take Mock Test
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StudentDashboard;
