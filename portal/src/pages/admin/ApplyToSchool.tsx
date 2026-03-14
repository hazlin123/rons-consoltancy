import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientService } from "../../services/clientService";
import { schoolService } from "../../services/schoolService";
import type { Client, School, SchoolApplicationFormData } from "../../types/clientJourney";
import { toast } from "sonner";
import {
    Buildings,
    ArrowLeft,
    FloppyDisk,
    Spinner,
    GraduationCap,
    Calendar,
    Notebook,
    User,
    Sparkle
} from "@phosphor-icons/react";
import { motion } from "framer-motion";

const ApplyToSchool = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [client, setClient] = useState<Client | null>(null);
    const [schools, setSchools] = useState<School[]>([]);

    const [formData, setFormData] = useState<SchoolApplicationFormData & { status?: string }>({
        client_id: id || "",
        school_id: "",
        program_type: "",
        intake_term: "",
        notes: "",
        status: "pending"
    });

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [clientData, schoolsData] = await Promise.all([
                clientService.getClientById(id!),
                schoolService.getAllSchools()
            ]);

            if (!clientData) {
                toast.error("Client not found");
                navigate("/admin/clients");
                return;
            }

            setClient(clientData);
            setSchools(schoolsData);
        } catch (error: any) {
            console.error("Error loading data:", error);
            toast.error("Failed to load application data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.school_id || !formData.program_type) {
            toast.error("Please select a school and program type");
            return;
        }

        setSubmitting(true);
        try {
            // 1. Create the application
            await schoolService.createApplication(formData);

            // 2. Update client stage if application is accepted or if currently at lower stage
            if (formData.status === 'accepted') {
                await clientService.updateClientStage(client!.id, 'visa');
            } else if (client && (client.current_stage === 'registered' || client.current_stage === 'ielts')) {
                await clientService.updateClientStage(client.id, 'school_application');
            }

            toast.success("School application submitted successfully!");
            navigate(`/admin/clients/${id}`);
        } catch (error: any) {
            console.error("Submission error:", error);
            toast.error(error.message || "Failed to submit application");
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

    const selectedSchool = schools.find(s => s.id === formData.school_id);

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
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center ring-2 ring-primary/20">
                        <Buildings className="w-7 h-7 text-primary" weight="duotone" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">New School Application</h1>
                        <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                            Applying for <span className="text-white font-bold">{client?.full_name}</span>
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
                        {/* School Selection */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-8">
                                <div className="w-12 h-12 modern-glass rounded-2xl flex items-center justify-center ring-1 ring-primary/10">
                                    <Buildings className="w-6 h-6 text-primary" weight="duotone" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Target Institution</h3>
                                    <p className="text-xs text-muted-foreground font-medium">Select the school and program</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="modern-input-group">
                                    <label className="modern-label">Select University/College *</label>
                                    <select
                                        className="modern-select"
                                        value={formData.school_id}
                                        onChange={(e) => {
                                            const school = schools.find(s => s.id === e.target.value);
                                            setFormData({
                                                ...formData,
                                                school_id: e.target.value,
                                                program_type: school?.program_types[0] || ""
                                            });
                                        }}
                                        required
                                    >
                                        <option value="">-- Select Institution --</option>
                                        {schools.map((school) => (
                                            <option key={school.id} value={school.id}>
                                                {school.name} ({school.country})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="modern-input-group">
                                        <label className="modern-label">Program Type *</label>
                                        <select
                                            className="modern-select disabled:opacity-30"
                                            value={formData.program_type}
                                            onChange={(e) => setFormData({ ...formData, program_type: e.target.value })}
                                            disabled={!formData.school_id}
                                            required
                                        >
                                            <option value="">-- Select Program --</option>
                                            {selectedSchool?.program_types.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="modern-input-group">
                                        <label className="modern-label">Intake Term</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" weight="duotone" />
                                            <input
                                                type="text"
                                                className="modern-input pl-12"
                                                placeholder="e.g. Fall 2024"
                                                value={formData.intake_term || ""}
                                                onChange={(e) => setFormData({ ...formData, intake_term: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="modern-input-group">
                                        <label className="modern-label">Initial Status</label>
                                        <select
                                            className="modern-select"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="pending">⏳ Pending</option>
                                            <option value="accepted">✅ Accepted</option>
                                            <option value="rejected">❌ Rejected</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="modern-input-group">
                                    <label className="modern-label">Application Notes</label>
                                    <div className="relative">
                                        <Notebook className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" weight="duotone" />
                                        <textarea
                                            className="modern-input pl-12 min-h-[120px] pt-4"
                                            placeholder="Any special requirements or status updates..."
                                            value={formData.notes || ""}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        />
                                    </div>
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
                                className="flex-1 bg-primary text-primary-foreground rounded-xl py-3.5 font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
                            >
                                {submitting ? (
                                    <>
                                        <Spinner className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <FloppyDisk className="w-5 h-5" weight="duotone" />
                                        Submit Application
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
                    <div className="modern-card p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <User weight="duotone" className="text-primary" />
                            Client Summary
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                                <span className="text-muted-foreground">Full Name:</span>
                                <span className="text-white font-bold">{client?.full_name}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm py-2">
                                <span className="text-muted-foreground">Current Stage:</span>
                                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{client?.current_stage}</span>
                            </div>
                        </div>
                    </div>

                    {selectedSchool && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="modern-card p-8 border-accent/20"
                        >
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                <Sparkle weight="duotone" className="text-accent" />
                                School Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Institution</span>
                                    <span className="text-sm font-bold text-white">{selectedSchool.name}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Location</span>
                                    <span className="text-sm font-bold text-muted-foreground">{selectedSchool.city}, {selectedSchool.country}</span>
                                </div>
                                {selectedSchool.tuition_range && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Tuition Range</span>
                                        <span className="text-sm font-bold text-white">{selectedSchool.tuition_range}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    <div className="p-6 modern-glass rounded-2xl border-dashed opacity-60">
                        <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                            <Sparkle className="inline mr-2 text-primary" />
                            Note: Submitting this application will automatically advance the client journey to the "School Application" stage if they are currently at Registration or IELTS stage.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ApplyToSchool;
