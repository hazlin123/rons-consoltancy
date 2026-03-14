import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { clientService } from "../../services/clientService";
import { ieltsService } from "../../services/ieltsService";
import type { Client, IELTSFormData, IELTSRegistrationType } from "../../types/clientJourney";
import { toast } from "sonner";
import {
    ClipboardText,
    ArrowLeft,
    FloppyDisk,
    Spinner,
    IdentificationCard,
    Calendar,
    Buildings,
    TrendUp,
    User,
    CheckCircle
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

const IELTSRegistrationForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isScoreMode = queryParams.get('mode') === 'score';
    const isEditMode = queryParams.get('mode') === 'edit';

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [client, setClient] = useState<Client | null>(null);

    const [formData, setFormData] = useState<IELTSFormData>({
        client_id: id || "",
        registration_type: isScoreMode ? "existing" : "new",
        exam_date: "",
        test_center: "",
        existing_score: undefined,
        existing_test_date: "",
        notes: ""
    });

    useEffect(() => {
        if (id) {
            loadClient();
        }
    }, [id]);

    const loadClient = async () => {
        setLoading(true);
        try {
            const data = await clientService.getClientById(id!);
            if (!data) {
                toast.error("Client not found");
                navigate("/admin/clients");
                return;
            }
            setClient(data);

            // If client already has a registration, pre-fill it
            if (data.ielts_registration) {
                setFormData({
                    client_id: id!,
                    registration_type: data.ielts_registration.registration_type as IELTSRegistrationType,
                    exam_date: data.ielts_registration.exam_date || "",
                    test_center: data.ielts_registration.test_center || "",
                    existing_score: data.ielts_registration.existing_score,
                    existing_test_date: data.ielts_registration.existing_test_date || "",
                    notes: data.ielts_registration.notes || ""
                });
            }
        } catch (error: any) {
            console.error("Error loading client:", error);
            toast.error("Failed to load client data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Sanitize data: convert empty strings to null for DB compatibility
            const submissionData: IELTSFormData = {
                ...formData,
                exam_date: formData.exam_date || null,
                existing_test_date: formData.existing_test_date || null,
                test_center: formData.test_center || null,
                notes: formData.notes || null,
                existing_score: formData.existing_score !== undefined ? formData.existing_score : null
            };

            console.log("Submitting IELTS Data:", submissionData);

            const result = await ieltsService.createIELTS(submissionData);
            console.log("IELTS save result:", result);

            // Advance stage to ielts if not already further along
            if (client && (client.current_stage === 'registered')) {
                console.log("Advancing stage to 'ielts' for client:", client.id);
                await clientService.updateClientStage(client.id, 'ielts');
            }

            toast.success("IELTS registration saved successfully!");

            // Give a small delay for the toast to be seen before navigating
            setTimeout(() => {
                navigate(`/admin/clients/${id}`);
            }, 1000);
        } catch (error: any) {
            console.error("Submission error:", error);
            toast.error(error.message || "Failed to save IELTS registration. Check if all required fields are valid.");
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
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center ring-2 ring-primary/20">
                        {isScoreMode ? <TrendUp className="w-7 h-7 text-primary" weight="duotone" /> : <ClipboardText className="w-7 h-7 text-primary" weight="duotone" />}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">
                            {isEditMode ? "Edit IELTS Record" : isScoreMode ? "Record Test Result" : "IELTS Registration"}
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                            {isEditMode ? "Update existing exam information for" : isScoreMode ? "Enter official exam scores for" : "Managing exam details for"} <span className="text-white font-bold">{client?.full_name}</span>
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
                        {/* Registration Type Switcher */}
                        <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Registration Details</h3>
                                    <p className="text-xs text-muted-foreground font-medium">Is this a new exam or an existing score?</p>
                                </div>

                            <div className="flex gap-4">
                                {(['new', 'existing'] as const).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, registration_type: type })}
                                        className={`flex-1 py-4 rounded-2xl border font-bold transition-all flex flex-col items-center gap-2 ${formData.registration_type === type
                                            ? 'bg-primary/10 border-primary text-white shadow-[0_0_20px_rgba(84,172,191,0.2)]'
                                            : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.registration_type === type ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground'
                                            }`}>
                                            {type === 'new' ? <Calendar weight="duotone" /> : <TrendUp weight="duotone" />}
                                        </div>
                                        <span className="text-xs uppercase tracking-widest">{type === 'new' ? 'New Registration' : 'Existing Score'}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Conditional Fields */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={formData.registration_type}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {formData.registration_type === 'new' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="modern-input-group">
                                            <label className="modern-label">Exam Date</label>
                                                <input
                                            type="date"
                                            className="modern-input"
                                            value={formData.exam_date || ""}
                                            onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                                        />
                                        </div>
                                        <div className="modern-input-group">
                                            <label className="modern-label">Test Center</label>
                                                <input
                                            type="text"
                                            className="modern-input"
                                            placeholder="e.g. British Council"
                                            value={formData.test_center || ""}
                                            onChange={(e) => setFormData({ ...formData, test_center: e.target.value })}
                                        />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="modern-input-group">
                                            <label className="modern-label">Overall Band Score</label>
                                                <input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="9"
                                            className="modern-input"
                                            placeholder="e.g. 7.5"
                                            value={formData.existing_score || ""}
                                            onChange={(e) => setFormData({ ...formData, existing_score: parseFloat(e.target.value) || undefined })}
                                        />
                                        </div>
                                        <div className="modern-input-group">
                                            <label className="modern-label">Test Date</label>
                                                <input
                                            type="date"
                                            className="modern-input"
                                            value={formData.existing_test_date || ""}
                                            onChange={(e) => setFormData({ ...formData, existing_test_date: e.target.value })}
                                        />
                                        </div>
                                    </div>
                                )}

                                <div className="modern-input-group">
                                    <label className="modern-label">Additional Notes</label>
                                    <textarea
                                        className="modern-input min-h-[120px] pt-4"
                                        placeholder="Record details about study materials, prep status, or certificate logistics..."
                                        value={formData.notes || ""}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>

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
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FloppyDisk className="w-5 h-5" weight="duotone" />
                                        Save IELTS Record
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
                                <span className="text-primary font-black uppercase tracking-widest text-[10px] bg-primary/10 px-2 py-0.5 rounded">
                                    {client?.current_stage.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 modern-glass rounded-3xl border border-white/5 flex flex-col items-center text-center">

                        <h4 className="text-white font-bold mb-2">Stage Advancement</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Registering a client for IELTS automatically moves them to the <span className="text-primary font-bold">IELTS Stage</span>.
                            Once the exam is marked as completed in the management dashboard, they will advance to School Applications.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default IELTSRegistrationForm;
