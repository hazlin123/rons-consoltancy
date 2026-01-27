import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    User,
    CheckCircle,
    MoreVertical,
    GraduationCap,
    Calendar,
    CreditCard
} from "lucide-react";

const StudentManagement = () => {
    const [search, setSearch] = useState("");
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchStudents = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    name,
                    email,
                    student_journeys (
                        tuition_status,
                        attendance_rate,
                        readiness_percent,
                        last_mock_score
                    )
                `)
                .eq('role', 'student');

            if (data) {
                setStudents(data.map(p => ({
                    id: p.id,
                    name: p.name || 'Unknown',
                    email: p.email,
                    status: p.student_journeys?.[0]?.tuition_status || 'Pending',
                    attendance: `${p.student_journeys?.[0]?.attendance_rate || 0}%`,
                    readiness: `${p.student_journeys?.[0]?.readiness_percent || 0}%`,
                    lastTest: p.student_journeys?.[0]?.last_mock_score || 'N/A'
                })));
            }
            setLoading(false);
        };

        fetchStudents();
    }, []);

    const handleAction = (action: string) => {
        toast({
            title: "Success",
            description: `${action} updated for all relevant students.`,
        });
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-soft border border-slate-100">
                <div>
                    <h2 className="text-2xl font-black italic">Student Directory</h2>
                    <p className="text-sm text-muted-foreground font-medium">Manage journey tracking and payments for all active clients.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        className="pl-10 h-12 rounded-2xl border-none bg-slate-50 focus-visible:ring-primary/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="font-black text-xs uppercase tracking-widest px-6 py-4">Student</TableHead>
                            <TableHead className="font-black text-xs uppercase tracking-widest">Tuition Status</TableHead>
                            <TableHead className="font-black text-xs uppercase tracking-widest">Attendance</TableHead>
                            <TableHead className="font-black text-xs uppercase tracking-widest">IELTS Readiness</TableHead>
                            <TableHead className="font-black text-xs uppercase tracking-widest">Last Test</TableHead>
                            <TableHead className="font-black text-xs uppercase tracking-widest text-right px-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((student) => (
                            <TableRow key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-foreground">{student.name}</div>
                                            <div className="text-xs text-muted-foreground font-medium">{student.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={`rounded-lg px-3 py-1 font-bold border-none ${student.status === 'Paid' ? 'bg-green-50 text-green-700' :
                                            student.status === 'Partial' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
                                            }`}
                                    >
                                        {student.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-bold text-foreground">{student.attendance}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-grow w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: student.readiness }}
                                            />
                                        </div>
                                        <span className="text-xs font-black italic">{student.readiness}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 font-black text-primary italic">
                                        <Trophy className="w-4 h-4 text-secondary" />
                                        {student.lastTest}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right px-6">
                                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button
                    onClick={() => handleAction("Attendance")}
                    className="h-16 rounded-2xl bg-primary text-white font-black italic gap-2 shadow-soft hover:shadow-hover"
                >
                    <Calendar className="w-5 h-5" /> Mark Today's Attendance
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleAction("Payment Status")}
                    className="h-16 rounded-2xl font-black italic gap-2 border-slate-100 hover:bg-slate-50 transition-all"
                >
                    <CreditCard className="w-5 h-5 text-green-600" /> Record Tuition Payment
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleAction("Test Scores")}
                    className="h-16 rounded-2xl font-black italic gap-2 border-slate-100 hover:bg-slate-50 transition-all"
                >
                    <GraduationCap className="w-5 h-5 text-primary" /> Update Test Scores
                </Button>
            </div>
        </div>
    );
};

const Trophy = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

export default StudentManagement;
