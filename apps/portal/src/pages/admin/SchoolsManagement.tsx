import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { schoolService } from "../../services/schoolService";
import type { School, SchoolFormData } from "../../types/clientJourney";
import { toast } from "sonner";
import {
    Buildings,
    MagnifyingGlass,
    Plus,
    PlusCircle,
    Trash,
    Globe,
    MapPin,
    ArrowLeft,
    DotsThreeVertical,
    CheckCircle,
    XCircle,
    Spinner,
    FloppyDisk,
    Pencil,
    X
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

const SchoolsManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingSchool, setEditingSchool] = useState<School | null>(null);

    const [formData, setFormData] = useState<SchoolFormData>({
        name: "",
        country: "",
        city: "",
        program_types: [],
        requirements: "",
        tuition_range: "",
        application_fee: undefined,
        website_url: ""
    });

    useEffect(() => {
        loadSchools();

        // Handle auto-opening the add modal
        const params = new URLSearchParams(location.search);
        if (params.get('action') === 'add') {
            setIsAddModalOpen(true);
            // Clear the param to avoid re-opening on refresh if desired, 
            // or just leave it for better UX on direct link
        }
    }, [location.search]);

    const loadSchools = async () => {
        setLoading(true);
        try {
            const data = await schoolService.getAllSchools(true);
            setSchools(data || []);
        } catch (error: any) {
            console.error("Error loading schools:", error);
            toast.error("Failed to load institutions");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove ${name}? This cannot be undone.`)) return;

        try {
            await schoolService.deleteSchool(id);
            toast.success(`${name} removed successfully`);
            loadSchools();
        } catch (error: any) {
            console.error("Delete error:", error);
            const msg = error.message || "";
            if (msg.includes("foreign key")) {
                toast.error(`Cannot remove ${name} because it has active applications. Clear those first.`);
            } else {
                toast.error(error.message || "Failed to remove school. Check database permissions.");
            }
        }
    };

    const handleToggleStatus = async (school: School) => {
        try {
            await schoolService.toggleSchoolStatus(school.id, !school.is_active);
            toast.success(`${school.name} is now ${!school.is_active ? 'active' : 'inactive'}`);
            loadSchools();
        } catch (error: any) {
            toast.error("Failed to update status");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.country) {
            toast.error("Name and Country are required");
            return;
        }
        setIsSubmitting(true);
        try {
            // Clean data: ensure optional fields are either set or omitted correctly
            const submissionData: any = {
                name: formData.name.trim(),
                country: formData.country.trim(),
                city: formData.city?.trim() || null,
                program_types: formData.program_types,
                requirements: formData.requirements?.trim() || null,
                tuition_range: formData.tuition_range?.trim() || null,
                website_url: formData.website_url?.trim() || null,
                is_active: true
            };

            // Only add application_fee if it is a number
            if (formData.application_fee !== undefined && formData.application_fee !== null) {
                submissionData.application_fee = Number(formData.application_fee);
            }

            if (editingSchool) {
                await schoolService.updateSchool(editingSchool.id, submissionData);
                toast.success(`${formData.name} updated successfully!`);
            } else {
                await schoolService.createSchool(submissionData);
                toast.success(`${formData.name} added successfully!`);
            }

            setIsAddModalOpen(false);
            setEditingSchool(null);

            // Reset form
            setFormData({
                name: "",
                country: "",
                city: "",
                program_types: [],
                requirements: "",
                tuition_range: "",
                application_fee: undefined,
                website_url: ""
            });

            loadSchools();
        } catch (error: any) {
            console.error("[SchoolsManagement] Save school error details:", error);
            const errorMsg = error.message || error.details || "Unknown database error";
            toast.error(`Failed to save school: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filtered = (schools || []).filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const programTypeOptions = ['Undergraduate', 'Masters', 'PhD', 'Diploma', 'Certificate'];

    return (
        <div className="min-h-screen bg-background p-6 text-foreground">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 font-bold text-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Overview
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center ring-2 ring-primary/20">
                            <Buildings className="w-7 h-7 text-primary" weight="duotone" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white">Institutions</h1>
                            <p className="text-muted-foreground text-sm font-medium">Manage the global school registry</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsAddModalOpen(true);
                        }}
                        className="bg-primary text-primary-foreground px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-3 shadow-lg hover:shadow-primary/20 transition-all uppercase tracking-tighter relative z-20 pointer-events-auto"
                    >
                        <PlusCircle weight="bold" className="w-5 h-5" />
                        Add New Institution
                    </motion.button>
                </div>
            </motion.div>

            {/* Controls */}
            <div className="mb-8 max-w-xl">
                <div className="relative">
                    <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground font-black" />
                    <input
                        type="text"
                        placeholder="Search schools by name or country..."
                        className="modern-input pl-11 py-3.5 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="modern-card p-6 h-48 animate-pulse bg-white/5" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="modern-card p-16 text-center border-dashed border-white/10">
                    <Buildings className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-20" weight="duotone" />
                    <h3 className="text-xl font-bold text-white mb-2">No institutions found</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Your institution registry is empty or no matches were found. Start by adding your first school.
                    </p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-6 text-primary font-bold hover:underline"
                    >
                        Click here to add one
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filtered.map((school, idx) => (
                            <motion.div
                                key={school.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`modern-card group hover:border-primary/30 transition-all duration-300 ${!school.is_active ? 'opacity-60 saturate-50' : ''}`}
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${school.is_active ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-400'}`}>
                                            {school.is_active ? <CheckCircle weight="fill" /> : <XCircle weight="fill" />}
                                            {school.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                        <div className="flex gap-1 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingSchool(school);
                                                    setFormData({
                                                        name: school.name,
                                                        country: school.country,
                                                        city: school.city || "",
                                                        program_types: school.program_types || [],
                                                        requirements: school.requirements || "",
                                                        tuition_range: school.tuition_range || "",
                                                        application_fee: school.application_fee,
                                                        website_url: school.website_url || ""
                                                    });
                                                    setIsAddModalOpen(true);
                                                }}
                                                className="p-2 text-muted-foreground hover:text-primary transition-colors h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/5"
                                                title="Edit Institution"
                                            >
                                                <Pencil weight="bold" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleStatus(school);
                                                }}
                                                className="p-2 text-muted-foreground hover:text-white transition-colors h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/5"
                                                title={school.is_active ? "Mark Inactive" : "Mark Active"}
                                            >
                                                {school.is_active ? <XCircle weight="bold" /> : <CheckCircle weight="bold" />}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(school.id, school.name);
                                                }}
                                                className="p-2 text-muted-foreground hover:text-red-400 transition-colors h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-500/10"
                                                title="Delete School"
                                            >
                                                <Trash weight="bold" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-lg font-black text-white leading-tight group-hover:text-primary transition-colors">
                                            {school.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5">
                                                <Globe weight="duotone" className="text-primary w-3 h-3" />
                                                {school.country}
                                            </div>
                                            {school.city && (
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin weight="duotone" className="text-accent w-3 h-3" />
                                                    {school.city}
                                                </div>
                                            )}
                                            {school.website_url && (
                                                <a
                                                    href={school.website_url.startsWith('http') ? school.website_url : `https://${school.website_url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex items-center gap-1.5 text-primary hover:text-accent transition-colors"
                                                >
                                                    <PlusCircle weight="duotone" className="w-3 h-3" />
                                                    Visit Website
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {school.requirements && (
                                            <p className="text-[10px] text-muted-foreground line-clamp-2 italic">
                                                "{school.requirements}"
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-1.5">
                                            {(school.program_types || []).map((type, i) => (
                                                <span key={i} className="text-[9px] font-black text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                        {school.tuition_range && (
                                            <p className="text-[10px] text-muted-foreground italic font-medium">
                                                Tuition: <span className="text-white not-italic font-bold">{school.tuition_range}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal Overlay */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={() => {
                                setIsAddModalOpen(false);
                                setEditingSchool(null);
                                setFormData({
                                    name: "",
                                    country: "",
                                    city: "",
                                    program_types: [],
                                    requirements: "",
                                    tuition_range: "",
                                    application_fee: undefined,
                                    website_url: ""
                                });
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="modern-card w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 p-10"
                        >
                            <button
                                onClick={() => {
                                    setIsAddModalOpen(false);
                                    setEditingSchool(null);
                                    setFormData({
                                        name: "",
                                        country: "",
                                        city: "",
                                        program_types: [],
                                        requirements: "",
                                        tuition_range: "",
                                        application_fee: undefined,
                                        website_url: ""
                                    });
                                }}
                                className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-white transition-colors"
                            >
                                <X weight="bold" className="w-6 h-6" />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center ring-2 ring-primary/30 shadow-lg">
                                    <PlusCircle weight="duotone" className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                                        {editingSchool ? "Edit Institution" : "Add Institution"}
                                    </h2>
                                    <p className="text-sm text-muted-foreground font-medium italic">
                                        {editingSchool ? `Updating details for ${editingSchool.name}` : "Register a new school to the catalog"}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="modern-input-group">
                                        <label className="modern-label font-black text-[10px] uppercase tracking-widest">Name *</label>
                                        <input
                                            type="text"
                                            className="modern-input"
                                            placeholder="University of Toronto"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="modern-input-group">
                                        <label className="modern-label font-black text-[10px] uppercase tracking-widest">Country *</label>
                                        <input
                                            type="text"
                                            className="modern-input"
                                            placeholder="Canada"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="modern-input-group">
                                        <label className="modern-label font-black text-[10px] uppercase tracking-widest">City</label>
                                        <input
                                            type="text"
                                            className="modern-input"
                                            placeholder="Toronto"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="modern-input-group">
                                        <label className="modern-label font-black text-[10px] uppercase tracking-widest">Tuition</label>
                                        <input
                                            type="text"
                                            className="modern-input"
                                            placeholder="$20k - $30k"
                                            value={formData.tuition_range}
                                            onChange={(e) => setFormData({ ...formData, tuition_range: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="modern-input-group">
                                    <label className="modern-label font-black text-[10px] uppercase tracking-widest">Website URL</label>
                                    <input
                                        type="url"
                                        className="modern-input"
                                        placeholder="https://www.utoronto.ca"
                                        value={formData.website_url}
                                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                    />
                                </div>

                                <div className="modern-input-group">
                                    <label className="modern-label font-black text-[10px] uppercase tracking-widest">Requirements</label>
                                    <textarea
                                        className="modern-input min-h-[100px] py-3"
                                        placeholder="GPA 3.0+, IELTS 6.5+, etc."
                                        value={formData.requirements}
                                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    />
                                </div>

                                <div className="modern-input-group">
                                    <label className="modern-label font-black text-[10px] uppercase tracking-widest">Programs</label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {programTypeOptions.map((type) => {
                                            const isSelected = formData.program_types.includes(type);
                                            return (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => {
                                                        const newTypes = isSelected
                                                            ? formData.program_types.filter(t => t !== type)
                                                            : [...formData.program_types, type];
                                                        setFormData({ ...formData, program_types: newTypes });
                                                    }}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${isSelected ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-muted-foreground'}`}
                                                >
                                                    {type}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 py-4 font-black uppercase text-xs text-muted-foreground border border-white/10 rounded-2xl hover:bg-white/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-4 font-black uppercase text-xs bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Spinner className="w-4 h-4 animate-spin" /> : <FloppyDisk className="w-4 h-4" />}
                                        {editingSchool ? "Update School" : "Save School"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SchoolsManagement;
