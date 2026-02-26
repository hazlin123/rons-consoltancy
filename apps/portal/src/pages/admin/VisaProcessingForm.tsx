import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { clientService } from "../../services/clientService";
import { visaService } from "../../services/visaService";
import { schoolService } from "../../services/schoolService";
import type { Client, VisaApplicationFormData, SchoolApplicationWithDetails } from "../../types/clientJourney";
import { toast } from "sonner";
import {
    Airplane,
    ArrowLeft,
    FloppyDisk,
    Spinner,
    IdentificationCard,
    Calendar,
    Notebook,
    User,
    Globe,
    Building
} from "@phosphor-icons/react";
import { motion } from "framer-motion";

const VisaProcessingForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we came from a specific school application context
    const initialSchoolAppId = new URLSearchParams(location.search).get('school_app_id');

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [client, setClient] = useState<Client | null>(null);
    const [schoolApps, setSchoolApps] = useState<SchoolApplicationWithDetails[]>([]);

    const [formData, setFormData] = useState<VisaApplicationFormData>({
        client_id: id || "",
        school_application_id: initialSchoolAppId || "",
        visa_type: "Student Visa",
        country: "",
        interview_date: "",
        notes: ""
    });

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [clientData, appsData] = await Promise.all([
                clientService.getClientById(id!),
                schoolService.getClientApplications(id!)
            ]);

            if (!clientData) {
                toast.error("Client not found");
                navigate("/admin/clients");
                return;
            }

            setClient(clientData);
            setSchoolApps(appsData);

            // Auto-set country if school app is selected
            if (initialSchoolAppId) {
                const app = appsData.find(a => a.id === initialSchoolAppId);
                if (app) {
                    setFormData(prev => ({ ...prev, country: app.school?.country || "" }));
                }
            }
        } catch (error: any) {
            console.error("Error loading data:", error);
            toast.error("Failed to load application data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.country || !formData.visa_type) {
            toast.error("Please fill in the required fields");
            return;
        }

        setSubmitting(true);
        try {
            console.log("[VisaProcessingForm] Submitting data:", formData);

            // Clean data: ensure empty strings are null for optional DB fields
            const submissionData: any = {
                client_id: formData.client_id,
                visa_type: formData.visa_type.trim(),
                country: formData.country.trim(),
                status: 'pending',
                notes: formData.notes?.trim() || null,
                school_application_id: formData.school_application_id || null,
                interview_date: formData.interview_date || null
            };

            console.log("[VisaProcessingForm] Cleaned data:", submissionData);

            await visaService.createVisaApplication(submissionData);

            // Advance stage to visa if not already there
            if (client && client.current_stage !== 'visa') {
                console.log("[VisaProcessingForm] Advancing client stage to 'visa'...");
                await clientService.updateClientStage(client.id, 'visa');
            }

            toast.success("Visa processing started successfully!");
            navigate(`/admin/clients/${id}`);
        } catch (error: any) {
            console.error("[VisaProcessingForm] Submission error details:", error);
            const errorMsg = error.message || error.details || "Unknown database error";
            toast.error(`Failed to start visa processing: ${errorMsg}`);

            if (errorMsg.includes("403") || errorMsg.includes("permission")) {
                alert("Database Permission Error: Please ensure you run the updated SQL fix script.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-12 flex items-center justify-center">
                <Spinner className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <button
                    onClick={() => navigate(`/admin/clients/${id}`)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-bold">Back to Profile</span>
                </button>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center ring-2 ring-accent/20">
                        <Airplane className="w-7 h-7 text-accent" weight="duotone" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">Visa Processing</h1>
                        <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                            Starting application for <span className="text-white font-bold">{client?.full_name}</span>
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Column */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-7"
                >
                    <form onSubmit={handleSubmit} className="modern-card p-10 space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-8">
                                <div className="w-12 h-12 modern-glass rounded-2xl flex items-center justify-center ring-1 ring-accent/10">
                                    <IdentificationCard className="w-6 h-6 text-accent" weight="duotone" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Application Details</h3>
                                    <p className="text-xs text-muted-foreground font-medium">Verify country and visa categories</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="modern-input-group">
                                    <label className="modern-label">Target Country *</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" weight="duotone" />
                                        <input
                                            type="text"
                                            className="modern-input pl-12"
                                            placeholder="e.g. Canada"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="modern-input-group">
                                    <label className="modern-label">Visa Type *</label>
                                    <input
                                        type="text"
                                        className="modern-input"
                                        placeholder="e.g. Study Permit"
                                        value={formData.visa_type}
                                        onChange={(e) => setFormData({ ...formData, visa_type: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="modern-input-group">
                                <label className="modern-label">Associated School Application (Optional)</label>
                                <div className="relative">
                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" weight="duotone" />
                                    <select
                                        className="modern-select pl-12"
                                        value={formData.school_application_id || ""}
                                        onChange={(e) => {
                                            const app = schoolApps.find(a => a.id === e.target.value);
                                            setFormData({
                                                ...formData,
                                                school_application_id: e.target.value,
                                                country: app?.school?.country || formData.country
                                            });
                                        }}
                                    >
                                        <option value="">-- None / General Application --</option>
                                        {schoolApps.filter(a => a.status === 'accepted').map((app) => (
                                            <option key={app.id} value={app.id}>
                                                {app.school?.name} ({app.program_type})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 italic px-1">Only accepted applications are shown here.</p>
                            </div>

                            <div className="modern-input-group">
                                <label className="modern-label">Interview Date (if scheduled)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" weight="duotone" />
                                    <input
                                        type="date"
                                        className="modern-input pl-12"
                                        value={formData.interview_date || ""}
                                        onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="modern-input-group">
                                <label className="modern-label">Processing Notes</label>
                                <div className="relative">
                                    <Notebook className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" weight="duotone" />
                                    <textarea
                                        className="modern-input pl-12 min-h-[120px] pt-4"
                                        placeholder="Document checklist, submission status, etc..."
                                        value={formData.notes || ""}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-white/5">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(`/admin/clients/${id}`)}
                                className="flex-1 py-3.5 rounded-xl border border-white/10 text-muted-foreground font-bold hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={submitting}
                                className="flex-1 bg-accent/20 text-accent border border-accent/30 rounded-xl py-3.5 font-bold flex items-center justify-center gap-3 hover:bg-accent hover:text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
                            >
                                {submitting ? (
                                    <>
                                        <Spinner className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <FloppyDisk className="w-5 h-5" weight="duotone" />
                                        Start Visa Process
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>

                {/* Info Column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-5 space-y-6"
                >
                    <div className="modern-card p-8 bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <User weight="duotone" className="text-accent" />
                            Client Summary
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                                <span className="text-muted-foreground">Full Name:</span>
                                <span className="text-white font-bold">{client?.full_name}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm py-2">
                                <span className="text-muted-foreground">National ID:</span>
                                <span className="text-white font-mono">{client?.national_id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 modern-glass rounded-3xl border border-white/5 flex flex-col items-center text-center">
                        <Airplane weight="duotone" className="w-16 h-16 text-accent/20 mb-6" />
                        <h4 className="text-white font-bold mb-2">Visa Verification</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Ensure all original academic documents and proof of funds are verified before submitting the final visa application to the embassy.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default VisaProcessingForm;
