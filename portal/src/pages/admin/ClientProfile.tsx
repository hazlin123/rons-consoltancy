import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientService } from "../../services/clientService";
import { ieltsService } from "../../services/ieltsService";
import { schoolService } from "../../services/schoolService";
import { visaService } from "../../services/visaService";
import type { ClientWithJourney, ClientStage, IELTSStatus, SchoolApplicationStatus } from "../../types/clientJourney";
import { toast } from "sonner";
import {
    ArrowLeft,
    IdentificationCard,
    Phone,
    Envelope,
    MapPin,
    Calendar,
    ClipboardText,
    Buildings,
    Airplane,
    CheckCircle,
    Clock,
    Plus,
    Pencil,
    CircleDashed,
    TrendUp,
    User
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const ClientProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [client, setClient] = useState<ClientWithJourney | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) loadClientData();
    }, [id]);

    const loadClientData = async () => {
        try {
            const data = await clientService.getClientById(id!);
            setClient(data);
        } catch (error: any) {
            console.error("Error loading client:", error);
            toast.error("Failed to load client details");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateIELTSStatus = async (ieltsId: string, status: IELTSStatus) => {
        try {
            await ieltsService.updateIELTSStatus(ieltsId, status);

            // If completed, advance to school application stage automatically
            if (status === 'completed' && client?.current_stage === 'ielts') {
                await clientService.updateClientStage(client.id, 'school_application');
                toast.success("IELTS completed! Journey advanced to School Application.");
            } else {
                toast.success(`IELTS status updated to ${status}`);
            }

            // Refresh data
            loadClientData();
        } catch (error: any) {
            console.error("Error updating status:", error);
            toast.error("Failed to update IELTS status");
        }
    };

    const handleUpdateSchoolAppStatus = async (appId: string, status: SchoolApplicationStatus) => {
        try {
            await schoolService.updateApplicationStatus(appId, status);

            // If accepted, advance to visa stage automatically
            if (status === 'accepted' && client?.current_stage === 'school_application') {
                await clientService.updateClientStage(client.id, 'visa');
                toast.success("Application accepted! Journey advanced to Visa Processing.");
            } else {
                toast.success(`School application status updated to ${status}`);
            }

            // Refresh data
            loadClientData();
        } catch (error: any) {
            console.error("Error updating school app status:", error);
            toast.error("Failed to update application status");
        }
    };

    const handleUpdateVisaStatus = async (visaId: string, status: string) => {
        try {
            await visaService.updateVisaStatus(visaId, status);

            // If approved, advance to completed stage
            if (status === 'approved' && client?.current_stage === 'visa') {
                await clientService.updateClientStage(client.id, 'completed');
                toast.success("Visa approved! Client journey successfully completed.");
            } else {
                toast.success(`Visa status updated to ${status}`);
            }

            loadClientData();
        } catch (error: any) {
            console.error("Error updating visa status:", error);
            toast.error("Failed to update visa status");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background p-12 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    if (!client) return (
        <div className="min-h-screen bg-background p-12 text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Client not found</h1>
            <button onClick={() => navigate("/admin/clients")} className="text-primary hover:underline">Return to list</button>
        </div>
    );

    const stages: { stage: ClientStage; label: string; icon: any; color: string }[] = [
        { stage: 'registered', label: 'Registration', icon: User, color: '#8a8d98' },
        { stage: 'ielts', label: 'IELTS', icon: ClipboardText, color: '#FFD700' },
        { stage: 'school_application', label: 'School Application', icon: Buildings, color: '#54ACBF' },
        { stage: 'visa', label: 'Visa Processing', icon: Airplane, color: '#A7EBF2' },
    ];

    const currentStageIndex = client.current_stage === 'completed'
        ? stages.length
        : stages.findIndex(s => s.stage === client.current_stage);

    return (
        <div className="min-h-screen bg-background p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate("/admin/clients")}
                            className="w-12 h-12 modern-glass rounded-2xl flex items-center justify-center text-muted-foreground hover:text-white transition-all ring-1 ring-white/10"
                        >
                            <ArrowLeft weight="bold" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-black text-white">{client.full_name}</h1>
                                <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded uppercase font-black tracking-widest border border-primary/30">Client Profile</span>
                            </div>
                            <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                                <MapPin weight="fill" className="text-primary" />
                                {client.county}, {client.constituency}
                                {client.passport_number && ` • Passport: ${client.passport_number}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(`/admin/clients/${client.id}/edit`)}
                            className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all"
                        >
                            <Pencil weight="bold" className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Timeline & Progress */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Journey Timeline */}
                    <div className="modern-card p-8">
                        <h2 className="text-xl font-bold text-white mb-10 flex items-center gap-3">
                            <Clock weight="duotone" className="text-primary" />
                            Client Journey Timeline
                        </h2>

                        <div className="relative flex justify-between items-start max-w-2xl mx-auto px-4">
                            {/* Connector Line */}
                            <div className="absolute top-6 left-0 right-0 h-1 bg-white/5 rounded-full z-0">
                                <div
                                    className="h-full bg-primary transition-all duration-700 rounded-full"
                                    style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                                />
                            </div>

                            {stages.map((s, idx) => {
                                const isCompleted = idx < currentStageIndex;
                                const isCurrent = idx === currentStageIndex;
                                return (
                                    <div key={s.stage} className="relative z-10 flex flex-col items-center gap-4 w-20 text-center">
                                        <div
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${isCompleted ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(84,172,191,0.4)]' :
                                                isCurrent ? 'bg-background border-primary text-primary shadow-lg scale-110' :
                                                    'bg-background border-white/10 text-muted-foreground'
                                                }`}
                                        >
                                            {isCompleted ? <CheckCircle weight="bold" className="w-6 h-6" /> : <s.icon weight="duotone" className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-primary' : isCompleted ? 'text-white' : 'text-muted-foreground'}`}>
                                                {s.label}
                                            </p>
                                            {isCurrent && <p className="text-[9px] text-primary/70 font-bold animate-pulse">ACTIVE</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stage Details Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* IELTS Details */}
                        <div className={`modern-card p-6 ${client.current_stage === 'ielts' ? 'ring-2 ring-primary/30 border-primary/20 bg-primary/5' : ''}`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                    <ClipboardText weight="duotone" className="text-primary" />
                                    IELTS Status
                                </h3>
                                {client.ielts_registration ? (
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black uppercase tracking-wider">{client.ielts_registration.status}</span>
                                ) : (
                                    <span className="text-[10px] bg-white/5 text-muted-foreground px-2 py-0.5 rounded font-black uppercase tracking-wider">Not Started</span>
                                )}
                            </div>

                            {client.ielts_registration ? (
                                <div className="space-y-4">
                                    {/* Status & Type Info */}
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground italic">Type:</span>
                                            <span className="text-white">{client.ielts_registration.registration_type}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground italic">Status:</span>
                                            <span className="text-primary">{client.ielts_registration.status}</span>
                                        </div>
                                    </div>

                                    {/* Main Metric (Score or Date) */}
                                    {client.ielts_registration.existing_score ? (
                                        <div className="flex flex-col items-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Overall Band Score</span>
                                            <span className="text-4xl font-black text-primary leading-none tabular-nums tracking-tighter">
                                                {client.ielts_registration.existing_score}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-muted-foreground">Exam Date:</span>
                                                <span className="text-white font-bold">{client.ielts_registration.exam_date || client.ielts_registration.existing_test_date || 'TBD'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-muted-foreground">Center:</span>
                                                <span className="text-white font-medium italic">{client.ielts_registration.test_center || 'Not specified'}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Secondary Info */}
                                    {(client.ielts_registration.existing_test_date || client.ielts_registration.exam_date) && client.ielts_registration.existing_score && (
                                        <div className="flex justify-between items-center text-[10px] px-1">
                                            <span className="text-muted-foreground uppercase font-black">Test Date:</span>
                                            <span className="text-white font-bold">{client.ielts_registration.existing_test_date || client.ielts_registration.exam_date}</span>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 pt-2">
                                        <button
                                            onClick={() => navigate(`/admin/clients/${client.id}/ielts?mode=edit`)}
                                            className="w-full bg-white/5 border border-white/10 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Pencil weight="bold" /> Edit Record
                                        </button>

                                        {client.ielts_registration.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateIELTSStatus(client.ielts_registration!.id, 'completed')}
                                                    className="flex-1 bg-primary/20 text-primary py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-primary/30"
                                                >
                                                    Mark Completed
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateIELTSStatus(client.ielts_registration!.id, 'cancelled')}
                                                    className="px-3 bg-red-500/10 text-red-400 py-2 rounded-xl text-[10px] font-black uppercase border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-4 text-center">
                                    <p className="text-xs text-muted-foreground mb-4 font-medium italic">No IELTS records found for this client.</p>
                                    <button
                                        onClick={() => navigate(`/admin/clients/${client.id}/ielts`)}
                                        className="text-primary text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 w-full hover:underline"
                                    >
                                        <Plus weight="bold" /> Start IELTS Process
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* School App Details */}
                        <div className={`modern-card p-6 ${client.current_stage === 'school_application' ? 'ring-2 ring-primary/30 border-primary/20 bg-primary/5' : ''}`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                    <Buildings weight="duotone" className="text-primary" />
                                    School Apps
                                </h3>
                                <span className="text-[10px] bg-white/5 text-muted-foreground px-2 py-0.5 rounded font-black uppercase tracking-wider">
                                    {client.school_applications?.length || 0} Applications
                                </span>
                            </div>

                            {client.school_applications && client.school_applications.length > 0 ? (
                                <div className="space-y-4">
                                    {client.school_applications.slice(0, 2).map((app, i) => (
                                        <div key={i} className={`p-4 rounded-xl border transition-all ${app.status === 'accepted' ? 'bg-primary/5 border-primary/20' : 'bg-white/5 border-white/5'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-xs font-bold text-white leading-tight">{app.school?.name}</p>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${app.status === 'accepted' ? 'bg-primary/20 text-primary' :
                                                    app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-white/5 text-muted-foreground'
                                                    }`}>{app.status}</span>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mb-4">{app.program_type}</p>

                                            {app.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateSchoolAppStatus(app.id, 'accepted')}
                                                        className="flex-1 bg-primary/20 text-primary py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-primary/30"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateSchoolAppStatus(app.id, 'rejected')}
                                                        className="px-2 bg-red-500/10 text-red-400 py-1.5 rounded-lg text-[9px] font-black uppercase border border-red-500/10 hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {client.school_applications.length > 2 && (
                                        <p className="text-[10px] text-primary text-center font-bold font-mono">+{client.school_applications.length - 2} more</p>
                                    )}
                                </div>
                            ) : (
                                <div className="py-4 text-center">
                                    <p className="text-xs text-muted-foreground mb-4 font-medium italic">No school applications submitted.</p>
                                </div>
                            )}
                        </div>

                        {/* Visa Details */}
                        <div className={`modern-card p-6 ${client.current_stage === 'visa' ? 'ring-2 ring-accent/30 border-accent/20 bg-accent/5' : ''}`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                    <Airplane weight="duotone" className="text-accent" />
                                    Visa Status
                                </h3>
                                {client.visa_application ? (
                                    <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded font-black uppercase tracking-wider">{client.visa_application.status}</span>
                                ) : (
                                    <span className="text-[10px] bg-white/5 text-muted-foreground px-2 py-0.5 rounded font-black uppercase tracking-wider">Not Started</span>
                                )}
                            </div>

                            {client.visa_application ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">School:</span>
                                        <span className="text-white font-bold">{client.visa_application.school_application?.school?.name || 'General Application'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">Type:</span>
                                        <span className="text-white font-bold">{client.visa_application.visa_type}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">Country:</span>
                                        <span className="text-white font-bold">{client.visa_application.country}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">Visa Launching Date:</span>
                                        <span className="text-accent font-bold">{client.visa_application.interview_date || 'TBD'}</span>
                                    </div>

                                    {/* Visa Status Actions */}
                                    <div className="pt-4 grid grid-cols-2 gap-2 border-t border-white/5">
                                        <button
                                            onClick={() => handleUpdateVisaStatus(client.visa_application!.id, 'interview_scheduled')}
                                            className="px-2 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-white hover:bg-accent/20 hover:border-accent/40 transition-all"
                                        >
                                            Schedule Launching
                                        </button>
                                        <button
                                            onClick={() => handleUpdateVisaStatus(client.visa_application!.id, 'approved')}
                                            className="px-2 py-2 bg-primary/20 border border-primary/30 rounded-lg text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10"
                                        >
                                            Approve Visa
                                        </button>
                                        <button
                                            onClick={() => handleUpdateVisaStatus(client.visa_application!.id, 'rejected')}
                                            className="px-2 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all col-span-2"
                                        >
                                            Mark Rejected
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-4 text-center">
                                    <p className="text-xs text-muted-foreground mb-4 font-medium italic">No visa application found.</p>
                                    <button
                                        onClick={() => navigate(`/admin/clients/${client.id}/visa`)}
                                        className="text-accent text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 w-full hover:underline"
                                    >
                                        <Plus weight="bold" /> Start Visa Process
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Contact & Quick Actions */}
                <div className="space-y-8">
                    {/* Contact Info Card */}
                    <div className="modern-card p-8">
                        <h2 className="text-lg font-bold text-white mb-6">Contact Information</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <Phone weight="duotone" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">Phone Number</p>
                                    <p className="text-sm font-bold text-white">{client.phone || "Not provided"}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <Envelope weight="duotone" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">Email Address</p>
                                    <p className="text-sm font-bold text-white truncate max-w-[150px]">{client.email || "Not provided"}</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="modern-card p-8 relative overflow-hidden group">

                        <h2 className="text-lg font-bold text-white mb-6">Quick Actions</h2>
                        <div className="space-y-3 relative z-10">
                            <button
                                onClick={() => navigate(`/admin/clients/${client.id}/apply`)}
                                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all font-mono tracking-tighter"
                            >
                                <Plus weight="bold" /> Apply to School
                            </button>
                            <button
                                onClick={() => navigate(`/admin/clients/${client.id}/visa`)}
                                className="w-full bg-accent/20 text-accent border border-accent/30 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-accent hover:text-white transition-all font-mono tracking-tighter"
                            >
                                <Airplane weight="bold" /> Start Visa Process
                            </button>
                            <button
                                onClick={() => navigate("/admin/ielts")}
                                className="w-full bg-white/5 border border-white/10 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                            >
                                <ClipboardText weight="bold" /> View IELTS Details
                            </button>
                            <button
                                onClick={() => toast.info("Activity logging will be available in the next release.")}
                                className="w-full bg-white/5 border border-white/10 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                            >
                                <CircleDashed weight="bold" /> Log Activity
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;
