import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocationSelector } from "../../components/admin/LocationSelector";
import { toast } from "sonner";
import { supabase } from "@rons/utils";
import {
    User,
    Briefcase,
    MapTrifold,
    CheckCircle,
    ArrowLeft,
    FloppyDisk,
    Info,
    CaretRight,
    Sparkle,
    Spinner
} from "@phosphor-icons/react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const StudentRegistration = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        nationalId: "",
        passportNumber: "",
        category: "",
        ieltsStatus: "",
        location: {
            county: "",
            constituency: "",
            ward: "",
        },
    });

    const handleLocationChange = (loc: any) => {
        setFormData((prev: any) => ({ ...prev, location: loc }));
    };

    const handleExecute = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.fullName.trim()) {
                throw new Error("Student Name is required. Please go back to Step 1.");
            }
            if (!formData.category) {
                throw new Error("Service Category is required. Please go back to Step 2.");
            }
            if (!formData.location.county) {
                throw new Error("County is required in Step 3.");
            }
            if (!formData.location.constituency) {
                throw new Error("Constituency is required in Step 3.");
            }

            const { error } = await supabase
                .from("clients")
                .insert([{
                    full_name: formData.fullName,
                    national_id: `TEMP_${Date.now()}`,
                    passport_number: formData.passportNumber || null,
                    current_stage: formData.category === 'New IELTS' ? 'ielts'
                        : formData.category === 'Visa Application' ? 'visa'
                            : (formData.category === 'Pre-existing IELTS' || formData.category === 'School App') ? 'school_application'
                                : 'registered',
                    county: formData.location.county,
                    constituency: formData.location.constituency,
                    ward: formData.location.ward,
                }]);

            if (error) throw error;

            toast.success("Student registered successfully.");
            navigate("/admin/dashboard");

        } catch (err: any) {
            const errorMessage = err.message || err.details || "Registration failed.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="modern-page max-w-4xl"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Page Header */}
            <motion.div variants={itemVariants} className="modern-section-header mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white mb-1">
                        Student <span className="text-gradient">Registration</span>
                    </h1>
                    <p className="modern-label flex items-center gap-2">
                        <Sparkle weight="duotone" className="w-3 h-3 text-primary" />
                        Onboard new talent to the consultancy
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/admin/dashboard")}
                    className="modern-button-secondary py-2.5 px-6"
                >
                    <ArrowLeft weight="bold" className="w-4 h-4" />
                    <span className="hidden sm:inline">Back to Overview</span>
                </motion.button>
            </motion.div>

            {/* Workflow Progress */}
            <motion.div variants={itemVariants} className="modern-card p-8 mb-8">
                <div className="flex items-center justify-between max-w-2xl mx-auto relative">
                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-black/5 -z-10"></div>
                    {[
                        { num: 1, label: "Identity", icon: User },
                        { num: 2, label: "Objective", icon: Briefcase },
                        { num: 3, label: "Deployment", icon: MapTrifold }
                    ].map((s, idx) => {
                        const isCurrent = step === s.num;
                        const isCompleted = step > s.num;
                        return (
                            <div key={s.num} className="flex flex-col items-center">
                                <motion.div
                                    animate={{
                                        scale: isCurrent ? 1.1 : 1,
                                        backgroundColor: isCurrent ? "var(--primary)" : isCompleted ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.05)"
                                    }}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isCurrent
                                        ? 'border-primary shadow-[0_8px_20px_rgba(153,205,216,0.25)]'
                                        : isCompleted
                                            ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
                                            : 'border-[#E5E7EB] text-[#6B7280] bg-[#F9FAFB]'
                                        }`}
                                >
                                    {isCompleted ? <CheckCircle weight="fill" className="w-6 h-6" /> : <s.icon weight="duotone" className="w-5 h-5" />}
                                </motion.div>
                                <span className={`text-[10px] font-black uppercase tracking-widest mt-4 ${isCurrent ? 'text-primary' : 'text-[#6B7280]'}`}>{s.label}</span>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
                <motion.form
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    onSubmit={(e) => e.preventDefault()}
                    className="modern-card p-10"
                >
                    {step === 1 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <div className="w-12 h-12 modern-glass rounded-2xl flex items-center justify-center ring-1 ring-primary/10">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Student Identity</h3>
                                    <p className="text-xs text-muted-foreground font-medium">Verify legal name for official records</p>
                                </div>
                            </div>

                            <div className="modern-input-group">
                                <label className="modern-label">Full Legal Name</label>
                                <input
                                    type="text"
                                    className="modern-input"
                                    placeholder="e.g. Alexander Pierce"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    autoFocus
                                />
                                <p className="text-[10px] text-muted-foreground flex items-center gap-2 italic">
                                    <Info className="w-3 h-3" />
                                    Must exactly match passport or official documents
                                </p>
                            </div>



                            <div className="modern-input-group">
                                <label className="modern-label">Passport Number (Optional)</label>
                                <input
                                    type="text"
                                    className="modern-input"
                                    placeholder="e.g. AK123456"
                                    value={formData.passportNumber}
                                    onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                                />
                                <p className="text-[10px] text-muted-foreground flex items-center gap-2 italic">
                                    <Info className="w-3 h-3" />
                                    Specify passport number for travel logistics
                                </p>
                            </div>
                        </div>
                    )}


                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <div className="w-12 h-12 modern-glass rounded-2xl flex items-center justify-center ring-1 ring-primary/10">
                                    <Briefcase className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Service Category</h3>
                                    <p className="text-xs text-muted-foreground font-medium">Define the engagement objective</p>
                                </div>
                            </div>

                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {[
                                    { id: "New IELTS", label: "IELTS Registration", desc: "Complete testing & certification" },
                                    { id: "Pre-existing IELTS", label: "IELTS Conversion", desc: "Using existing valid scores" },
                                    { id: "Visa Application", label: "Visa Processing", desc: "International travel logistics" },
                                    { id: "School App", label: "Academic Application", desc: "Institution enrollment services" }
                                ].map((cat) => (
                                    <motion.button
                                        variants={itemVariants}
                                        key={cat.id}
                                        type="button"
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setFormData({ ...formData, category: cat.id })}
                                        className={`p-6 rounded-3xl border text-left transition-all duration-300 group ${formData.category === cat.id
                                            ? 'bg-primary/10 border-primary shadow-[0_8px_20px_rgba(84,172,191,0.2)]'
                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-colors ${formData.category === cat.id ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground'
                                            }`}>
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <h4 className={`text-sm font-bold mb-1 ${formData.category === cat.id ? 'text-white' : 'text-muted-foreground'}`}>{cat.label}</h4>
                                        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">{cat.desc}</p>
                                    </motion.button>
                                ))}
                            </motion.div>

                            {formData.category === "School App" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="p-6 modern-glass rounded-3xl border-dashed"
                                >
                                    <label className="modern-label mb-4 block">IELTS Examination Status</label>
                                    <div className="flex gap-4">
                                        {['Done', 'Not Done'].map((status) => (
                                            <motion.button
                                                key={status}
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setFormData({ ...formData, ieltsStatus: status })}
                                                className={`flex-1 py-3 rounded-2xl border text-xs font-bold transition-all ${formData.ieltsStatus === status
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-white/5 border-white/10 text-[#8a8d98] hover:bg-white/10'
                                                    }`}
                                            >
                                                {status === 'Done' ? 'Completed' : 'Pending'}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <div className="w-12 h-12 modern-glass rounded-2xl flex items-center justify-center ring-1 ring-primary/20">
                                    <MapTrifold weight="duotone" className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Deployment Location</h3>
                                    <p className="text-xs text-[#8a8d98] font-medium">Regional routing and logistics</p>
                                </div>
                            </div>

                            <div className="modern-glass p-8 rounded-3xl border-white/5">
                                <LocationSelector onLocationChange={handleLocationChange} />
                            </div>

                            {formData.location.county && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 modern-card bg-emerald-500/5 border-emerald-500/20"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Registration Summary</span>
                                        <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase">Ready for Submission</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-[#8a8d98] uppercase">Full Name</span>
                                            <span className="text-xs font-bold text-white">{formData.fullName}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-[#8a8d98] uppercase">Category</span>
                                            <span className="text-xs font-bold text-white">{formData.category}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-[#8a8d98] uppercase">Deployment</span>
                                            <span className="text-xs font-bold text-white">{formData.location.county}{formData.location.constituency ? ` > ${formData.location.constituency}` : ''}</span>
                                        </div>
                                        {formData.ieltsStatus && (
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-[#8a8d98] uppercase">IELTS Status</span>
                                                <span className="text-xs font-bold text-white">{formData.ieltsStatus}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Foot Controls */}
                    <div className="mt-12 flex items-center justify-between gap-4">
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setStep((s: number) => Math.max(1, s - 1))}
                            disabled={step === 1 || loading}
                            className="modern-button-secondary py-3 px-8 disabled:opacity-30 disabled:cursor-not-allowed group"
                        >
                            <ArrowLeft weight="bold" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Previous
                        </motion.button>

                        {step < 3 ? (
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setStep((s: number) => Math.min(3, s + 1))}
                                disabled={(!formData.fullName && step === 1) || (!formData.category && step === 2)}
                                className="modern-button-primary py-3 px-10 disabled:opacity-30 disabled:cursor-not-allowed group"
                            >
                                Continue <CaretRight weight="bold" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        ) : (
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleExecute}
                                disabled={loading || !formData.location.county}
                                className="modern-button-primary bg-[#10b981] hover:bg-[#059669] shadow-[0_0_30px_rgba(16,185,129,0.2)] py-3 px-12 disabled:opacity-30 flex items-center gap-3 text-white"
                            >
                                {loading ? <Spinner weight="duotone" className="w-5 h-5 animate-spin" /> : <FloppyDisk weight="duotone" className="w-5 h-5" />}
                                Complete Registration
                            </motion.button>
                        )}
                    </div>
                </motion.form>
            </AnimatePresence>

            <motion.div
                variants={itemVariants}
                className="mt-8 flex justify-center opacity-30"
            >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8a8d98]">Verified System Pipeline</p>
            </motion.div>
        </motion.div>
    );
};

export default StudentRegistration;
