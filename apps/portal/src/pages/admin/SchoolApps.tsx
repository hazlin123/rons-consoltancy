import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    CurrencyDollar,
    ArrowLeft,
    Clock,
    CheckCircle,
    XCircle,
    DotsThreeVertical,
    TrendUp,
    Calendar,
    Buildings,
    Sparkle,
    Plus,
    MagnifyingGlass,
    MapPin,
    GraduationCap
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { schoolService } from "../../services/schoolService";
import { clientService } from "../../services/clientService";
import type { SchoolApplicationWithDetails, SchoolApplicationStatus } from "../../types/clientJourney";
import { format } from "date-fns";

const SchoolApps = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<SchoolApplicationWithDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const data = await schoolService.getAllApplications();
            setApplications(data);
        } catch (error: any) {
            console.error("Error loading apps:", error);
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, clientId: string, status: SchoolApplicationStatus) => {
        try {
            await schoolService.updateApplicationStatus(id, status);

            // If accepted, advance to visa stage
            if (status === 'accepted') {
                await clientService.updateClientStage(clientId, 'visa');
                toast.success("Application accepted! Journey advanced to Visa Processing.");
            } else if (status === 'withdrawn') {
                toast.success("Application withdrawn successfully");
            } else {
                toast.success(`Status updated to ${status}`);
            }

            loadApplications();
        } catch (error: any) {
            toast.error("Failed to update status");
        }
    };

    const handleDeleteApplication = async (id: string, clientName: string) => {
        if (!confirm(`Are you sure you want to delete the application for ${clientName}?`)) return;

        try {
            await schoolService.deleteApplication(id);
            toast.success("Application deleted successfully");
            loadApplications();
        } catch (error: any) {
            toast.error("Failed to delete application");
        }
    };

    const statusColors: Record<SchoolApplicationStatus, { color: string; bg: string }> = {
        pending: { color: "#FFD700", bg: "rgba(255, 215, 0, 0.1)" },
        accepted: { color: "#54ACBF", bg: "rgba(84, 172, 191, 0.1)" },
        rejected: { color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
        withdrawn: { color: "#8a8d98", bg: "rgba(138, 141, 152, 0.1)" }
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-bold">Back to Overview</span>
                </button>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center ring-2 ring-primary/20">
                            <Buildings className="w-7 h-7 text-primary" weight="duotone" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white">School Applications</h1>
                            <p className="text-muted-foreground text-sm font-medium">Manage institutional admissions</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        onClick={() => navigate("/admin/clients")}
                        className="modern-card p-8 border-dashed flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-primary/5 transition-all"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">New Application</h3>
                        <p className="text-sm text-muted-foreground">Start a selection process for a client</p>
                    </div>

                    <div className="md:col-span-2 modern-card p-8 bg-gradient-to-br from-primary/20 to-transparent relative overflow-hidden">
                        <div className="relative z-10">
                            <Sparkle className="w-12 h-12 text-primary mb-4" weight="duotone" />
                            <h2 className="text-2xl font-black text-white mb-2">Institutional Catalog</h2>
                            <p className="text-muted-foreground text-sm mb-6 max-w-md">Access our verified database of partner universities and colleges across Canada and Australia.</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate("/admin/institutions")}
                                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                                >
                                    Explore Schools
                                </button>
                                <button
                                    onClick={() => navigate("/admin/institutions?action=add")}
                                    className="bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all"
                                >
                                    Add New School
                                </button>
                            </div>
                        </div>
                        <Buildings className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
                    </div>
                </div>
            </motion.div>

            {/* Applications List */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">Active Applications</h2>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Managing student placements and decisions</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="modern-card p-6 h-48 animate-pulse bg-white/5" />
                        ))}
                    </div>
                ) : applications.length === 0 ? (
                    <div className="modern-card p-12 text-center border-dashed">
                        <MagnifyingGlass className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-white/20">No school applications found</h3>
                        <p className="text-white/10 text-sm italic">Start a new application from a client's profile</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {applications.map((app: SchoolApplicationWithDetails, idx: number) => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="modern-card group hover:border-primary/30 transition-all duration-300"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-6">
                                            <div
                                                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"
                                                style={{
                                                    color: statusColors[app.status as SchoolApplicationStatus].color,
                                                    backgroundColor: statusColors[app.status as SchoolApplicationStatus].bg
                                                }}
                                            >
                                                {app.status === 'accepted' ? <CheckCircle weight="fill" className="w-3 h-3" /> : <Clock weight="fill" className="w-3 h-3" />}
                                                {app.status}
                                            </div>
                                            <div className="relative group/menu">
                                                <button className="text-muted-foreground hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
                                                    <DotsThreeVertical weight="bold" className="w-5 h-5" />
                                                </button>
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-[#023859] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
                                                    <button
                                                        onClick={() => navigate(`/admin/clients/${app.client_id}`)}
                                                        className="w-full px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-white hover:bg-primary/20 transition-colors flex items-center gap-2"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                        View Profile
                                                    </button>
                                                    {app.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(app.id, app.client_id, 'withdrawn')}
                                                            className="w-full px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-yellow-500 hover:bg-yellow-500/10 transition-colors flex items-center gap-2"
                                                        >
                                                            <Clock className="w-3 h-3" />
                                                            Withdraw
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteApplication(app.id, app.client?.full_name || 'Client')}
                                                        className="w-full px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                                    >
                                                        <XCircle className="w-3 h-3" />
                                                        Delete Record
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/20">
                                                <GraduationCap weight="duotone" className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-sm leading-tight">{app.client?.full_name}</h3>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{app.school?.name}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                                <Buildings className="w-4 h-4" />
                                                {app.program_type}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                                <Calendar className="w-4 h-4" />
                                                Intake: {app.intake_term || "TBD"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex flex-col gap-3 group-hover:bg-primary/5 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-muted-foreground font-bold">Applied {format(new Date(app.application_date), "MMM d, yyyy")}</span>
                                            <button
                                                onClick={() => navigate(`/admin/clients/${app.client_id}`)}
                                                className="text-xs font-black text-primary hover:text-accent transition-colors flex items-center gap-1 uppercase tracking-tighter"
                                            >
                                                View Profile
                                                <Plus weight="bold" className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {app.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(app.id, app.client_id, 'accepted')}
                                                    className="flex-1 bg-primary/20 text-primary py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-primary/30"
                                                >
                                                    Approve Application
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(app.id, app.client_id, 'rejected')}
                                                    className="px-3 bg-red-500/10 text-red-400 py-2 rounded-xl text-[10px] font-black uppercase border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchoolApps;
