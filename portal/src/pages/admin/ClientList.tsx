import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientService } from "../../services/clientService";
import type { Client, ClientStage } from "../../types/clientJourney";
import { toast } from "sonner";
import {
    Plus,
    MagnifyingGlass,
    Users,
    Funnel,
    Trash,
    Eye,
    ArrowLeft
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const STAGE_CONFIG: Record<ClientStage, { label: string; color: string; bgColor: string }> = {
    registered: { label: "Registered", color: "#8a8d98", bgColor: "#8a8d98/10" },
    ielts: { label: "IELTS", color: "#FFD700", bgColor: "#FFD700/10" },
    school_application: { label: "School App", color: "#54ACBF", bgColor: "#54ACBF/10" },
    visa: { label: "Visa", color: "#A7EBF2", bgColor: "#A7EBF2/10" },
    completed: { label: "Completed", color: "#10b981", bgColor: "#10b981/10" },
};

const ClientList = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [stageFilter, setStageFilter] = useState<ClientStage | "all">("all");

    useEffect(() => {
        loadClients();
    }, []);

    useEffect(() => {
        filterClients();
    }, [clients, searchQuery, stageFilter]);

    const loadClients = async () => {
        try {
            const data = await clientService.getAllClients();
            setClients(data);
        } catch (error: any) {
            console.error("Error loading clients:", error);
            toast.error("Failed to load clients");
        } finally {
            setLoading(false);
        }
    };

    const filterClients = () => {
        let filtered = clients;

        // Filter by stage
        if (stageFilter !== "all") {
            filtered = filtered.filter(c => c.current_stage === stageFilter);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                c.full_name.toLowerCase().includes(query) ||
                c.national_id.toLowerCase().includes(query) ||
                c.email?.toLowerCase().includes(query)
            );
        }

        setFilteredClients(filtered);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}? This will remove all associated records.`)) {
            return;
        }

        try {
            await clientService.deleteClient(id);
            toast.success("Client deleted successfully");
            loadClients();
        } catch (error: any) {
            console.error("Error deleting client:", error);
            toast.error("Failed to delete client");
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
                    onClick={() => navigate("/admin/dashboard")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-bold">Back to Overview</span>
                </button>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center ring-2 ring-primary/20">
                            <Users className="w-7 h-7 text-primary" weight="duotone" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white">Client Management</h1>
                            <p className="text-muted-foreground text-sm font-medium">
                                {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'}
                            </p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/admin/clients/new")}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus className="w-5 h-5" weight="bold" />
                        New Client
                    </motion.button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" weight="bold" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-card border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Stage Filter */}
                    <div className="flex gap-2 items-center">
                        <Funnel className="w-5 h-5 text-muted-foreground" weight="bold" />
                        <select
                            value={stageFilter}
                            onChange={(e) => setStageFilter(e.target.value as any)}
                            className="px-4 py-3 bg-card border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                        >
                            <option value="all">All Stages</option>
                            {Object.entries(STAGE_CONFIG).map(([stage, config]) => (
                                <option key={stage} value={stage}>{config.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Client List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {loading ? (
                    <div className="modern-card p-12 text-center">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading clients...</p>
                    </div>
                ) : filteredClients.length === 0 ? (
                    <div className="modern-card p-12 text-center">
                        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" weight="duotone" />
                        <h3 className="text-xl font-bold text-white mb-2">No clients found</h3>
                        <p className="text-muted-foreground mb-6">
                            {searchQuery || stageFilter !== "all"
                                ? "Try adjusting your filters"
                                : "Get started by registering your first client"}
                        </p>
                        {!searchQuery && stageFilter === "all" && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/admin/clients/new")}
                                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" weight="bold" />
                                Register First Client
                            </motion.button>
                        )}
                    </div>
                ) : (
                    <div className="modern-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Client</th>
                                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact</th>
                                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</th>
                                        <th className="text-center p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Stage</th>
                                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Registered</th>
                                        <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filteredClients.map((client, index) => (
                                            <motion.tr
                                                key={client.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0 ring-1 ring-primary/20">
                                                            {client.full_name.charAt(0)}
                                                        </div>
                                                        <span className="text-white font-bold">{client.full_name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-1">
                                                        {client.phone && (
                                                            <span className="text-white text-xs">{client.phone}</span>
                                                        )}
                                                        {client.email && (
                                                            <span className="text-muted-foreground text-xs">{client.email}</span>
                                                        )}
                                                        {!client.phone && !client.email && (
                                                            <span className="text-muted-foreground text-xs italic">No contact</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-white text-xs font-bold">{client.county}</span>
                                                        {client.constituency && (
                                                            <span className="text-muted-foreground text-xs">{client.constituency}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span
                                                        className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                                                        style={{
                                                            color: STAGE_CONFIG[client.current_stage].color,
                                                            backgroundColor: STAGE_CONFIG[client.current_stage].bgColor.replace('/', ' / '),
                                                        }}
                                                    >
                                                        {STAGE_CONFIG[client.current_stage].label}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-muted-foreground text-xs">
                                                        {format(new Date(client.created_at), "dd MMM yyyy")}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => navigate(`/admin/clients/${client.id}`)}
                                                            className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                                                            title="View client journey"
                                                        >
                                                            <Eye weight="duotone" className="w-4 h-4" />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1, backgroundColor: "#ef4444", color: "#fff" }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleDelete(client.id, client.full_name)}
                                                            className="p-2.5 rounded-xl bg-red-500/10 text-red-400 transition-all duration-300"
                                                            title="Delete client"
                                                        >
                                                            <Trash weight="duotone" className="w-4 h-4" />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ClientList;
