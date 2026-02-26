import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ieltsService } from "../../services/ieltsService";
import type { IELTSRegistrationWithClient, IELTSStatus } from "../../types/clientJourney";
import { clientService } from "../../services/clientService";
import { toast } from "sonner";
import {
    ClipboardText,
    MagnifyingGlass,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    IdentificationCard,
    Calendar,
    Buildings,
    DotsThreeVertical,
    TrendUp,
    ArrowLeft
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const IELTSManagement = () => {
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState<IELTSRegistrationWithClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'all' | 'pending' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadRegistrations();
    }, []);

    const loadRegistrations = async () => {
        setLoading(true);
        try {
            const data = await ieltsService.getAllIELTS();
            setRegistrations(data);
        } catch (error: any) {
            console.error("Error loading IELTS:", error);
            toast.error("Failed to load IELTS registrations");
        } finally {
            setLoading(false);
        }
    };

    const filtered = registrations.filter(reg => {
        const matchesTab = tab === 'all' || reg.status === tab;
        const matchesSearch = searchQuery.trim() === "" ||
            reg.client?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.client?.national_id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleUpdateStatus = async (id: string, clientId: string, status: IELTSStatus) => {
        try {
            await ieltsService.updateIELTSStatus(id, status);

            // If completed, advance to school application stage
            if (status === 'completed') {
                await clientService.updateClientStage(clientId, 'school_application');
                toast.success("IELTS completed! Journey advanced to School Application.");
            } else {
                toast.success(`Status updated to ${status}`);
            }

            loadRegistrations();
        } catch (error: any) {
            toast.error("Failed to update status");
        }
    };

    const statusColors: Record<IELTSStatus, { color: string; bg: string; icon: any }> = {
        pending: { color: "#FFD700", bg: "#FFD700/10", icon: Clock },
        completed: { color: "#54ACBF", bg: "#54ACBF/10", icon: CheckCircle },
        cancelled: { color: "#ef4444", bg: "#ef4444/10", icon: XCircle }
    };

    return (
        <div className="min-h-screen bg-background p-6">
            {/* Header */}
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
                            <ClipboardText className="w-7 h-7 text-primary" weight="duotone" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white">IELTS Management</h1>
                            <p className="text-muted-foreground text-sm font-medium">Tracking exams and results</p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex bg-card p-1 rounded-2xl border border-white/5">
                        {(['all', 'pending', 'completed'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${tab === t
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'text-muted-foreground hover:text-white'
                                    }`}
                            >
                                {t.charAt(0)?.toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="w-full md:w-80 relative">
                        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search registrations..."
                            className="modern-input pl-11 py-2.5 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="modern-card p-6 h-48 animate-pulse bg-white/5" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="modern-card p-12 text-center">
                    <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" weight="duotone" />
                    <h3 className="text-xl font-bold text-white mb-2">No registrations found</h3>
                    <p className="text-muted-foreground">Adjust your filters or register a client for IELTS first.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filtered.map((reg, idx) => {
                            const StatusIcon = statusColors[reg.status].icon;
                            return (
                                <motion.div
                                    key={reg.id}
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
                                                    color: statusColors[reg.status].color,
                                                    backgroundColor: statusColors[reg.status].bg.replace('/', ' / ')
                                                }}
                                            >
                                                <StatusIcon weight="fill" className="w-3 h-3" />
                                                {reg.status}
                                            </div>
                                            <button className="text-muted-foreground hover:text-white transition-colors">
                                                <DotsThreeVertical weight="bold" className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/20 transition-colors">
                                                <IdentificationCard weight="duotone" className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-sm leading-tight text-gradient">{reg.client?.full_name}</h3>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{reg.client?.national_id}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {reg.registration_type === 'new' ? (
                                                <>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                                        <Calendar className="w-4 h-4" />
                                                        {reg.exam_date ? format(new Date(reg.exam_date), "MMM dd, yyyy") : "Date TBD"}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                                        <Buildings className="w-4 h-4" />
                                                        {reg.test_center || "Center Not Assigned"}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-3 text-xs text-white font-bold">
                                                        <TrendUp className="w-4 h-4 text-primary" />
                                                        Score: {reg.existing_score || "N/A"}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                                        <Calendar className="w-4 h-4" />
                                                        Tested: {reg.existing_test_date ? format(new Date(reg.existing_test_date), "MMM dd, yyyy") : "Unknown"}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex flex-col gap-3 group-hover:bg-primary/5 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-muted-foreground font-bold">Updated {format(new Date(reg.updated_at), "MMM d")}</span>
                                            <button
                                                onClick={() => navigate(`/admin/clients/${reg.client_id}`)}
                                                className="text-xs font-black text-primary hover:text-accent transition-colors flex items-center gap-1 uppercase tracking-tighter"
                                            >
                                                View Profile
                                                <Plus weight="bold" className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {reg.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(reg.id, reg.client_id, 'completed')}
                                                    className="flex-1 bg-primary/20 text-primary py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-primary/30"
                                                >
                                                    Mark Completed
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(reg.id, reg.client_id, 'cancelled')}
                                                    className="px-3 bg-red-500/10 text-red-400 py-2 rounded-xl text-[10px] font-black uppercase border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default IELTSManagement;
