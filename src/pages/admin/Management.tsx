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

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const StudentManagement = () => {
    const [search, setSearch] = useState("");
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingStudent, setEditingStudent] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const { toast } = useToast();

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    student_id,
                    name,
                    email,
                    student_journeys (
                        id,
                        tuition_status,
                        attendance_rate,
                        readiness_percent,
                        last_mock_score,
                        registration_date,
                        course_study_status,
                        mock_exams_date,
                        target_exam_date
                    )
                `)
                .eq('role', 'student');

            if (error) throw error;

            console.log("Fetched profiles data:", data);
            if (data) {
                const mappedData = data.map(p => ({
                    id: p.id,
                    studentId: p.student_id || 'N/A',
                    name: p.name || 'Unknown',
                    email: p.email,
                    journey: p.student_journeys?.[0] || {},
                    status: p.student_journeys?.[0]?.tuition_status || 'Pending',
                    attendance: `${p.student_journeys?.[0]?.attendance_rate || 0}%`,
                    readiness: `${p.student_journeys?.[0]?.readiness_percent || 0}%`,
                    lastTest: p.student_journeys?.[0]?.last_mock_score || 'N/A'
                }));
                console.log("Mapped students:", mappedData);
                setStudents(mappedData);
            }
        } catch (error: any) {
            console.error("Management fetch error:", error);
            toast({
                title: "Fetch Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleAction = async (action: 'attendance' | 'payment' | 'score') => {
        if (selectedStudents.length === 0) {
            toast({
                title: "No Selection",
                description: "Please select at least one student.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            for (const studentId of selectedStudents) {
                const student = students.find(s => s.id === studentId);
                if (!student?.journey?.id) continue;

                const updates: any = {};
                if (action === 'attendance') updates.attendance_rate = Math.min(100, (parseInt(student.attendance) || 0) + 1);
                if (action === 'payment') updates.tuition_status = 'Cleared';
                if (action === 'score') updates.readiness_percent = Math.min(100, (parseInt(student.readiness) || 0) + 5);

                await supabase
                    .from('student_journeys')
                    .update(updates)
                    .eq('id', student.journey.id);
            }

            toast({
                title: "Bulk Update Successful",
                description: `Updated ${action} for ${selectedStudents.length} students.`,
            });
            setSelectedStudents([]);
            fetchStudents();
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.rpc('sync_missing_profiles');
            if (error) throw error;
            toast({
                title: "Sync Successful",
                description: "All registered users have been synchronized with the directory.",
            });
            fetchStudents();
        } catch (error: any) {
            toast({
                title: "Sync Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveJourney = async () => {
        if (!editingStudent) return;

        const { error } = await supabase
            .from('student_journeys')
            .update({
                tuition_status: editingStudent.journey.tuition_status,
                readiness_percent: editingStudent.journey.readiness_percent,
                course_study_status: editingStudent.journey.course_study_status,
                registration_date: editingStudent.journey.registration_date,
                mock_exams_date: editingStudent.journey.mock_exams_date,
                target_exam_date: editingStudent.journey.target_exam_date,
            })
            .eq('id', editingStudent.journey.id);

        if (error) {
            toast({
                title: "Error",
                description: "Failed to update journey. Please try again.",
                variant: "destructive",
            });
        } else {
            toast({
                title: "Success",
                description: `Journey for ${editingStudent.name} has been updated.`,
            });
            setIsDialogOpen(false);
            fetchStudents();
        }
    };

    return (
        <div className="space-y-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black italic text-primary">Manage Journey: {editingStudent?.name}</DialogTitle>
                    </DialogHeader>
                    {editingStudent && (
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Tuition Status</Label>
                                <Select
                                    value={editingStudent.journey.tuition_status}
                                    onValueChange={(v) => setEditingStudent({
                                        ...editingStudent,
                                        journey: { ...editingStudent.journey, tuition_status: v }
                                    })}
                                >
                                    <SelectTrigger className="rounded-xl bg-slate-50 border-none font-bold">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-xl">
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Cleared">Cleared</SelectItem>
                                        <SelectItem value="Overdue">Overdue</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Course Study Status</Label>
                                <Select
                                    value={editingStudent.journey.course_study_status}
                                    onValueChange={(v) => setEditingStudent({
                                        ...editingStudent,
                                        journey: { ...editingStudent.journey, course_study_status: v }
                                    })}
                                >
                                    <SelectTrigger className="rounded-xl bg-slate-50 border-none font-bold">
                                        <SelectValue placeholder="Select Progress" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-xl">
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Paused">Paused</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Readiness (%)</Label>
                                    <Input
                                        type="number"
                                        value={editingStudent.journey.readiness_percent}
                                        onChange={(e) => setEditingStudent({
                                            ...editingStudent,
                                            journey: { ...editingStudent.journey, readiness_percent: parseInt(e.target.value) }
                                        })}
                                        className="rounded-xl bg-slate-50 border-none font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Mock Exam Date</Label>
                                    <Input
                                        type="date"
                                        value={editingStudent.journey.mock_exams_date || ""}
                                        onChange={(e) => setEditingStudent({
                                            ...editingStudent,
                                            journey: { ...editingStudent.journey, mock_exams_date: e.target.value }
                                        })}
                                        className="rounded-xl bg-slate-50 border-none font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Target Exam Date</Label>
                                <Input
                                    type="date"
                                    value={editingStudent.journey.target_exam_date || ""}
                                    onChange={(e) => setEditingStudent({
                                        ...editingStudent,
                                        journey: { ...editingStudent.journey, target_exam_date: e.target.value }
                                    })}
                                    className="rounded-xl bg-slate-50 border-none font-bold"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            onClick={handleSaveJourney}
                            className="w-full h-14 bg-primary text-secondary rounded-2xl font-black shadow-lg shadow-primary/20"
                        >
                            Save Journey Updates
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-soft border border-slate-100">
                <div>
                    <h2 className="text-2xl font-black italic">Student Directory</h2>
                    <p className="text-sm text-muted-foreground font-medium">Manage journey tracking and payments for all active clients.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-12 px-4 rounded-xl text-primary font-black uppercase tracking-widest bg-primary/5 hover:bg-primary/10 transition-all gap-2"
                        onClick={handleSync}
                        disabled={loading}
                    >
                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Sync New Signups
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-2xl bg-slate-50 border-none hover:bg-primary/5 hover:text-primary transition-colors"
                        onClick={fetchStudents}
                        disabled={loading}
                    >
                        <svg
                            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </Button>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search name, email or status..."
                            className="pl-10 h-12 rounded-2xl border-none bg-slate-50 focus-visible:ring-primary/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="w-12 px-6">
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-200 text-primary focus:ring-primary"
                                    checked={selectedStudents.length === students.length && students.length > 0}
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedStudents(students.map(s => s.id));
                                        else setSelectedStudents([]);
                                    }}
                                />
                            </TableHead>
                            <TableHead className="font-black text-xs uppercase tracking-widest py-4">Student ID</TableHead>
                            <TableHead className="font-black text-xs uppercase tracking-widest">Student</TableHead>
                            <TableHead className="font-black text-xs uppercase tracking-widest">Joined</TableHead>
                            <TableHead className="font-black text-xs uppercase tracking-widest">Tuition</TableHead>
                            <TableHead className="font-black text-xs uppercase tracking-widest">Attendance</TableHead>
                            <TableHead className="font-black text-xs uppercase tracking-widest">IELTS Readiness</TableHead>
                            <TableHead className="font-black text-xs uppercase tracking-widest text-right px-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-slate-400 font-bold uppercase tracking-widest">Loading students...</TableCell>
                            </TableRow>
                        ) : students.filter(s =>
                            s.name.toLowerCase().includes(search.toLowerCase()) ||
                            s.email.toLowerCase().includes(search.toLowerCase()) ||
                            s.studentId.toLowerCase().includes(search.toLowerCase()) ||
                            s.status.toLowerCase().includes(search.toLowerCase())
                        ).length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                                            <User className="w-12 h-12" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-primary">No Students Found</h3>
                                            <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">
                                                Your database shows users in Auth, but they haven't been synced to the Directory yet.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={handleSync}
                                            className="bg-primary text-secondary font-black rounded-2xl h-12 px-8 shadow-lg shadow-primary/20"
                                        >
                                            Sync Existing Users Now
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : students.filter(s =>
                            s.name.toLowerCase().includes(search.toLowerCase()) ||
                            s.email.toLowerCase().includes(search.toLowerCase()) ||
                            s.studentId.toLowerCase().includes(search.toLowerCase()) ||
                            s.status.toLowerCase().includes(search.toLowerCase())
                        ).map((student) => (
                            <TableRow key={student.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${selectedStudents.includes(student.id) ? 'bg-primary/5' : ''}`}>
                                <TableCell className="px-6">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-200 text-primary focus:ring-primary"
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedStudents([...selectedStudents, student.id]);
                                            else setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge variant="outline" className="rounded-lg bg-emerald-50 text-emerald-700 border-none px-3 py-1 font-black text-[10px] tracking-widest">
                                        {student.studentId}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4">
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
                                <TableCell className="text-xs font-bold text-slate-500 uppercase">
                                    {student.journey.registration_date ? new Date(student.journey.registration_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={`rounded-lg px-3 py-1 font-bold border-none ${student.status === 'Cleared' ? 'bg-green-50 text-green-700' :
                                            student.status === 'Partial' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
                                            }`}
                                    >
                                        {student.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-bold text-foreground">{student.attendance}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black italic text-primary">{student.readiness}</span>
                                            <span className="text-[10px] font-bold text-slate-400">Score: {student.lastTest}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: student.readiness }}
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right px-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-xl p-2 min-w-[160px]">
                                            <DropdownMenuItem
                                                className="rounded-xl font-bold cursor-pointer py-3 focus:bg-primary/5 focus:text-primary"
                                                onClick={() => {
                                                    setEditingStudent(student);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                Edit Journey
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl font-bold cursor-pointer py-3 focus:bg-red-50 focus:text-red-600">
                                                Archive Student
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button
                    disabled={loading || selectedStudents.length === 0}
                    onClick={() => handleAction("attendance")}
                    className="h-16 rounded-2xl bg-primary text-white font-black italic gap-2 shadow-soft hover:shadow-hover disabled:opacity-50"
                >
                    <Calendar className="w-5 h-5" /> Mark Present ({selectedStudents.length})
                </Button>
                <Button
                    variant="outline"
                    disabled={loading || selectedStudents.length === 0}
                    onClick={() => handleAction("payment")}
                    className="h-16 rounded-2xl font-black italic gap-2 border-slate-100 hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                    <CreditCard className="w-5 h-5 text-green-600" /> Record Tuition ({selectedStudents.length})
                </Button>
                <Button
                    variant="outline"
                    disabled={loading || selectedStudents.length === 0}
                    onClick={() => handleAction("score")}
                    className="h-16 rounded-2xl font-black italic gap-2 border-slate-100 hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                    <GraduationCap className="w-5 h-5 text-primary" /> Boost Readiness ({selectedStudents.length})
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
