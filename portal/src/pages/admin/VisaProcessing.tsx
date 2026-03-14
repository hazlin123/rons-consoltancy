import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { visaService } from "../../services/visaService";
import { clientService } from "../../services/clientService";
import type { VisaApplicationWithDetails } from "../../types/clientJourney";
import {
    Airplane,
    IdentificationCard,
    Stamp,
    Clock,
    CheckCircle,
    WarningCircle,
    MagnifyingGlass,
    ArrowLeft,
    User,
    Calendar,
    Pencil,
    Spinner,
    ArrowRight
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const VisaProcessing = () => {
    const navigate = useNavigate();
    const [visas, setVisas] = useState<VisaApplicationWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        loadVisas();
    }, [filter]);

    const loadVisas = async () => {
        setLoading(true);
        try {
            const data = await visaService.getAllVisas(filter === "all" ? undefined : filter);
            setVisas(data || []);
        } catch (error: any) {
            console.error("Error loading visas:", error);
            toast.error("Failed to load visa applications");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, name: string, status: string, clientId?: string) => {
        try {
            await visaService.updateVisaStatus(id, status);

            // If approved, advance client stage to completed
            if (status === 'approved' && clientId) {
                await clientService.updateClientStage(clientId, 'completed');
                toast.success(`Visa approved for ${name}! Journey completed.`);
            } else {
                toast.success(`${name}'s status updated to ${status}`);
            }

            loadVisas();
        } catch (error: any) {
            console.error("Error updating visa status:", error);
            toast.error("Failed to update status");
        }
    };

    const stats = {
        pending: visas.filter(v => v.status === 'pending').length,
        interview: visas.filter(v => v.status === 'interview_scheduled').length,
        approved: visas.filter(v => v.status === 'approved').length,
        rejected: visas.filter(v => v.status === 'rejected').length
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'text-primary bg-primary/10 border-primary/20';
            case 'interview_scheduled': return 'text-accent bg-accent/10 border-accent/20';
            case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-muted-foreground bg-white/5 border-white/10';
        }
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
                            <Airplane className="w-7 h-7 text-primary" weight="duotone" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white">Visa Processing</h1>
                            <p className="text-muted-foreground text-sm font-medium">Final stage documentation and tracking</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Pending', count: stats.pending, icon: Clock, color: '#8a8d98', filter: 'pending' },
                        { label: 'Launching', count: stats.interview, icon: Calendar, color: '#54ACBF', filter: 'interview_scheduled' },
                        { label: 'Approved', count: stats.approved, icon: CheckCircle, color: '#10b981', filter: 'approved' },
                        { label: 'Rejected', count: stats.rejected, icon: WarningCircle, color: '#ef4444', filter: 'rejected' },
                    ].map((stat, i) => (
                        <button
                            key={i}
                            onClick={() => setFilter(filter === stat.filter ? 'all' : stat.filter)}
                            className={`modern-card p-5 flex items-center gap-4 text-left transition-all ${filter === stat.filter ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-white/5'}`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center" style={{ color: stat.color }}>
                                <stat.icon weight="duotone" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                <p className="text-xl font-black text-white tabular-nums">{stat.count}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Active Pipeline</h2>
                            {filter !== 'all' && (
                                <button onClick={() => setFilter('all')} className="text-xs text-primary font-bold hover:underline">Clear Filters</button>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <Spinner className="w-12 h-12 text-primary animate-spin mb-4" />
                                <p className="text-muted-foreground font-medium italic">Syncing with registry...</p>
                            </div>
                        ) : visas.length === 0 ? (
                            <div className="modern-card p-12 text-center border-dashed">
                                <Stamp className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <h3 className="text-xl font-bold text-white/20">No matching records found</h3>
                                <p className="text-white/10 text-sm italic">Records appear here once visa processing starts</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <AnimatePresence>
                                    {visas.map((visa, idx) => (
                                        <motion.div
                                            key={visa.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="modern-card p-6 hover:border-primary/30 transition-all flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border ${getStatusColor(visa.status)}`}>
                                                        {visa.status.replace('_', ' ')}
                                                    </div>
                                                    <button
                                                        onClick={() => navigate(`/admin/clients/${visa.client_id}`)}
                                                        className="text-muted-foreground hover:text-white transition-colors"
                                                    >
                                                        <ArrowRight weight="bold" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                                                        <User weight="duotone" className="text-primary w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-white leading-none mb-1">{visa.client?.full_name}</p>
                                                        <p className="text-[10px] text-muted-foreground font-bold italic">{visa.country} • {visa.visa_type}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mb-6">
                                                    <div className="flex justify-between text-[10px] font-bold">
                                                        <span className="text-muted-foreground">School:</span>
                                                        <span className="text-white truncate max-w-[150px]">{visa.school_application?.school?.name || 'General Application'}</span>
                                                    </div>
                                                    <div className="flex justify-between text-[10px] font-bold">
                                                        <span className="text-muted-foreground">Launching Date:</span>
                                                        <span className="text-accent">{visa.interview_date || 'TBD'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(visa.id, visa.client?.full_name || 'Client', 'interview_scheduled', visa.client_id)}
                                                    className="px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-tighter text-white hover:bg-accent/20 transition-all"
                                                >
                                                    Schedule Launch
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(visa.id, visa.client?.full_name || 'Client', 'approved', visa.client_id)}
                                                    className="px-2 py-2 bg-primary/20 border border-primary/10 rounded-lg text-[8px] font-black uppercase tracking-tighter text-primary hover:bg-primary hover:text-white transition-all"
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VisaProcessing;
