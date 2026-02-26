import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocationSelector } from "../../components/admin/LocationSelector";
import { toast } from "sonner";
import { clientService } from "../../services/clientService";
import type { ClientFormData } from "../../types/clientJourney";
import {
    User,
    ArrowLeft,
    FloppyDisk,
    Sparkle,
    Spinner,
    IdentificationCard,
    Envelope,
    Phone
} from "@phosphor-icons/react";
import { motion } from "framer-motion";

const ClientRegistration = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ClientFormData>({
        full_name: "",
        national_id: "",
        passport_number: "",
        email: "",
        phone: "",
        county: "",
        constituency: "",
        ward: "",
    });

    const handleLocationChange = (loc: any) => {
        setFormData((prev) => ({
            ...prev,
            county: loc.county,
            constituency: loc.constituency,
            ward: loc.ward,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.full_name.trim()) {
                throw new Error("Full name is required");
            }
            if (!formData.national_id.trim()) {
                throw new Error("National ID is required");
            }
            if (!formData.county) {
                throw new Error("County is required");
            }

            await clientService.createClient(formData);

            toast.success("Client registered successfully!");
            navigate("/admin/clients");
        } catch (error: any) {
            console.error("Registration error:", error);
            toast.error(error.message || "Failed to register client");
        } finally {
            setLoading(false);
        }
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
                    onClick={() => navigate("/admin/clients")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-bold">Back to Clients</span>
                </button>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center ring-2 ring-primary/20">
                        <Sparkle className="w-7 h-7 text-primary" weight="duotone" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">New Client Registration</h1>
                        <p className="text-muted-foreground text-sm font-medium">Begin the client journey</p>
                    </div>
                </div>
            </motion.div>

            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="max-w-3xl"
            >
                <div className="modern-card p-10 space-y-8">
                    {/* Personal Information Section */}
                    <div>
                        <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-8">
                            <div className="w-12 h-12 modern-glass rounded-2xl flex items-center justify-center ring-1 ring-primary/10">
                                <User className="w-6 h-6 text-primary" weight="duotone" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Personal Information</h3>
                                <p className="text-xs text-muted-foreground font-medium">Client identity and contact details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="modern-input-group md:col-span-2">
                                <label className="modern-label">Full Legal Name *</label>
                                <input
                                    type="text"
                                    className="modern-input"
                                    placeholder="e.g. John Kamau Mwangi"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>

                            {/* National ID */}
                            <div className="modern-input-group">
                                <label className="modern-label">Kenyan National ID *</label>
                                <div className="relative">
                                    <IdentificationCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" weight="duotone" />
                                    <input
                                        type="text"
                                        className="modern-input pl-12"
                                        placeholder="12345678"
                                        value={formData.national_id}
                                        onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                                        maxLength={8}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Passport Number */}
                            <div className="modern-input-group">
                                <label className="modern-label">Passport Number (Optional)</label>
                                <div className="relative">
                                    <IdentificationCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" weight="duotone" />
                                    <input
                                        type="text"
                                        className="modern-input pl-12"
                                        placeholder="AK123456"
                                        value={formData.passport_number || ""}
                                        onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="modern-input-group">
                                <label className="modern-label">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" weight="duotone" />
                                    <input
                                        type="tel"
                                        className="modern-input pl-12"
                                        placeholder="+254 712 345 678"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="modern-input-group md:col-span-2">
                                <label className="modern-label">Email Address</label>
                                <div className="relative">
                                    <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" weight="duotone" />
                                    <input
                                        type="email"
                                        className="modern-input pl-12"
                                        placeholder="john.mwangi@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div>
                        <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-8">
                            <div className="w-12 h-12 modern-glass rounded-2xl flex items-center justify-center ring-1 ring-primary/10">
                                <User className="w-6 h-6 text-primary" weight="duotone" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Location Details</h3>
                                <p className="text-xs text-muted-foreground font-medium">Regional information *</p>
                            </div>
                        </div>

                        <LocationSelector
                            onLocationChange={handleLocationChange}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-white/5">
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/admin/clients")}
                            className="flex-1 py-3.5 rounded-xl border border-white/10 text-muted-foreground font-bold hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className="flex-1 bg-primary text-primary-foreground rounded-xl py-3.5 font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Spinner className="w-5 h-5 animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                <>
                                    <FloppyDisk className="w-5 h-5" weight="duotone" />
                                    Register Client
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </motion.form>
        </div>
    );
};

export default ClientRegistration;
