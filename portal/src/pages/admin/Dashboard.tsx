import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    UsersThree,
    Briefcase,
    ShieldCheck,
    SquaresFour,
    Spinner,
    Trash,
    TrendUp,
    CalendarBlank,
    Printer,
    DownloadSimple,
    ArrowsClockwise,
    ChartBar,
    Airplane,
    Student,
    ClipboardText,
    Buildings,
    MagnifyingGlass,
    Globe,
    CheckCircle
} from "@phosphor-icons/react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    AreaChart,
    Area
} from "recharts";
import { dashboardService, DashboardStats, RegistrationTrend, RegionalDistribution } from "../../services/dashboardService";
import { analyticsService, AnalyticsStats, VisitTrend } from "../../services/analyticsService";
import { clientService } from "../../services/clientService";
import { visaService } from "../../services/visaService";
import { ClientJourneyStats, Client, VisaApplicationWithDetails } from "../../types/clientJourney";
import { supabase } from "@rons/utils";
import { format } from "date-fns";
import { toast } from "sonner";

import { motion, AnimatePresence, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [journeyStats, setJourneyStats] = useState<ClientJourneyStats | null>(null);
    const [trends, setTrends] = useState<RegistrationTrend[]>([]);
    const [regions, setRegions] = useState<RegionalDistribution[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [approvedVisas, setApprovedVisas] = useState<VisaApplicationWithDetails[]>([]);
    const [visitStats, setVisitStats] = useState<AnalyticsStats | null>(null);
    const [visitTrends, setVisitTrends] = useState<VisitTrend[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        try {
            const [statsData, journeyData, trendsData, regionsData, clientsData, visitData, visitTrendsData, approvedData] = await Promise.all([
                dashboardService.getDashboardStats(),
                clientService.getJourneyStats(),
                dashboardService.getRegistrationTrends(),
                dashboardService.getRegionalDistribution(),
                clientService.getAllClients(),
                analyticsService.getVisitStats(),
                analyticsService.getVisitTrends(),
                visaService.getAllVisas('approved')
            ]);
            setStats(statsData);
            setJourneyStats(journeyData);
            setTrends(trendsData);
            setRegions(regionsData);
            setClients(clientsData);
            setVisitStats(visitData);
            setVisitTrends(visitTrendsData);
            setApprovedVisas(approvedData || []);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStudent = async (studentId: string, studentName: string) => {
        if (!confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
            return;
        }

        try {
            await clientService.deleteClient(studentId);

            toast.success(`${studentName} has been removed from the registry.`);
            fetchData(); // Refresh data after deletion
        } catch (error: any) {
            console.error("Error deleting student:", error);
            toast.error(error.message || "Failed to delete student.");
        }
    };

    useEffect(() => {
        fetchData();

        const channel = supabase
            .channel("dashboard-updates")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "clients" },
                () => {
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading && !stats) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                >
                    <Spinner weight="duotone" className="w-12 h-12 text-primary animate-spin" />
                </motion.div>
            </div>
        );
    }

    const kpiItems = [
        { label: "Active Clients", val: journeyStats?.total_clients || 0, icon: SquaresFour, color: "#54ACBF", path: "/admin/clients" },
        { label: "IELTS Stage", val: journeyStats?.at_ielts_stage || 0, icon: ClipboardText, color: "#FFD700", path: "/admin/ielts" },
        { label: "School Apps", val: journeyStats?.at_school_stage || 0, icon: Buildings, color: "#54ACBF", path: "/admin/school-apps" },
        { label: "Visa Approved", val: journeyStats?.visa_approved || 0, icon: ShieldCheck, color: "#22c55e", path: "/admin/visa?filter=approved" },
    ];

    const filteredClients = clients.filter((client: Client) =>
        client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.national_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.county?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCSV = () => {
        const headers = ["Client Name", "ID", "Location", "Current Stage", "Last Updated"];
        const csvData = filteredClients.map((row: Client) => [
            row.full_name,
            row.national_id,
            `${row.county} ${row.constituency ? `> ${row.constituency}` : ''}`,
            row.current_stage,
            format(new Date(row.updated_at), "dd/MM/yyyy")
        ]);

        const csvContent = [
            headers.join(","),
            ...csvData.map((row: string[]) => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `student-registry-${format(new Date(), "yyyy-MM-dd")}.csv`;
        a.click();
        toast.success("Registry exported successfully.");
    };

    return (
        <motion.div
            className="modern-page"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Page Header */}
            <motion.div variants={itemVariants} className="modern-section-header">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-1">
                        Dashboard <span className="text-gradient">Overview</span>
                    </h1>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                        <CalendarBlank weight="duotone" className="w-3 h-3 text-primary" />
                        Last Synced: {format(new Date(), "dd MMM yyyy, HH:mm")}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fetchData()}
                        className="modern-button-secondary py-2.5 px-5 group"
                    >
                        <ArrowsClockwise weight="duotone" className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                        <span className="hidden sm:inline">Sync Data</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.print()}
                        className="modern-button-primary py-2.5 px-6"
                    >
                        <Printer weight="duotone" className="w-4 h-4" />
                        <span className="hidden sm:inline">Export Report</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* KPI Grid */}
            <motion.div variants={containerVariants} className="modern-stat-grid mt-4 mb-10">
                {kpiItems.map((item, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(item.path)}
                        className="modern-stat-card group cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                                style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}30` }}
                            >
                                <item.icon weight="duotone" className="w-6 h-6" style={{ color: item.color }} />
                            </div>
                            <div className="flex flex-col items-end">
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="modern-label">{item.label}</p>
                            <h3 className="text-3xl font-black text-white tabular-nums tracking-tighter">
                                {item.val.toLocaleString()}
                            </h3>
                        </div>
                        {/* Glowing accent */}
                        <div
                            className="absolute -bottom-2 -right-2 w-24 h-24 blur-[60px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                            style={{ backgroundColor: item.color }}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Analytics Section Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                {/* Traffic Overview */}
                <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
                    <div className="modern-card p-8 flex flex-col h-full bg-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <TrendUp weight="duotone" className="w-5 h-5 text-primary" />
                                    Website Traffic <span className="text-muted-foreground font-medium text-sm ml-2">Real-time</span>
                                </h3>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(84,172,191,0.6)]"></div>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Page Views</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(167,235,242,0.6)]"></div>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Unique Users</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[280px] w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={visitTrends}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                    <XAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#023859',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '16px',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                            color: '#fff'
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="views"
                                        stroke="var(--primary)"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorViews)"
                                        animationDuration={2000}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="visitors"
                                        stroke="var(--accent)"
                                        strokeWidth={4}
                                        fill="transparent"
                                        animationDuration={2500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>

                {/* Growth Metrics Side Panel */}
                <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
                    <div className="modern-card p-8 bg-gradient-to-br from-primary/5 to-transparent h-full flex flex-col justify-between">
                        <div className="flex flex-col gap-8">
                            <motion.div whileHover={{ x: 5 }} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <UsersThree weight="duotone" className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="modern-label text-primary">Total Reach</span>
                                    <span className="text-3xl font-black text-white">{visitStats?.totalViews || 0}</span>
                                </div>
                            </motion.div>
                            <div className="h-px w-full bg-[#E5E7EB]"></div>
                            <motion.div whileHover={{ x: 5 }} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                                    <UsersThree weight="duotone" className="w-4 h-4 text-[#F3C3B2]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="modern-label text-accent">Unique Sessions</span>
                                    <span className="text-3xl font-black text-white">{visitStats?.uniqueVisitors || 0}</span>
                                </div>
                            </motion.div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-[#F3F4F6]">
                            <p className="text-[#6B7280] text-[11px] leading-relaxed italic opacity-80">
                                "The platform reach has expanded by 22% compared to the previous assessment period."
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Visa Approvals */}
            <motion.div variants={itemVariants} className="modern-section-header mt-12 mb-6">
                <div className="flex flex-col gap-1">
                    <h2 className="modern-section-title">
                        <ShieldCheck weight="duotone" className="w-5 h-5 text-primary" />
                        Recently Approved Visas
                    </h2>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Celebrating student success & travel ready milestones</p>
                </div>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {approvedVisas.length === 0 ? (
                    <div className="col-span-full py-12 text-center modern-card bg-white/5 border-dashed flex flex-col items-center justify-center gap-3">
                        <Airplane weight="duotone" className="w-8 h-8 text-white/10" />
                        <p className="text-muted-foreground italic text-sm">No approved visas recorded yet.</p>
                    </div>
                ) : (
                    approvedVisas.slice(0, 3).map((visa) => (
                        <motion.div
                            key={visa.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="modern-card p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 flex items-center gap-4 relative group cursor-pointer"
                            onClick={() => navigate(`/admin/clients/${visa.client_id}`)}
                        >
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary ring-2 ring-primary/20 shrink-0">
                                {visa.client?.full_name?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold truncate">{visa.client?.full_name}</h4>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium mt-1">
                                    <Globe className="w-3 h-3 text-accent" weight="duotone" />
                                    <span className="truncate">{visa.country}</span>
                                    <span className="opacity-30">•</span>
                                    <span>{format(new Date(visa.updated_at), "dd MMM")}</span>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                                <CheckCircle weight="duotone" className="w-5 h-5 text-green-400" />
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {/* Registration Analytics */}
            <motion.div variants={itemVariants} className="modern-section-header mt-8">
                <h2 className="modern-section-title">
                    <ChartBar weight="duotone" className="w-5 h-5 text-primary" />
                    Student Registration Analytics
                </h2>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                {/* Registration Trends */}
                <div className="lg:col-span-12">
                    <div className="modern-card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                <TrendUp weight="duotone" className="w-4 h-4 text-muted-foreground" />
                                Registration Trends <span className="text-muted-foreground font-medium text-sm">(7 Days)</span>
                            </h3>
                        </div>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trends}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#8a8d98', fontSize: 11, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#8a8d98', fontSize: 11, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '16px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                            color: '#111827'
                                        }}
                                        cursor={{ fill: '#F9FAFB' }}
                                    />
                                    <Bar
                                        dataKey="val"
                                        fill="var(--primary)"
                                        radius={[8, 8, 0, 0]}
                                        barSize={40}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Client Journey Pipeline Registry */}
            <motion.div variants={itemVariants} className="modern-section-header mt-12 mb-6">
                <div className="flex flex-col gap-1">
                    <h2 className="modern-section-title">Client Journey Pipeline</h2>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Tracking students through multi-stage processing</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportToCSV}
                    className="modern-button-secondary py-2.5 px-6"
                >
                    <DownloadSimple weight="duotone" className="w-4 h-4" />
                    Export CSV
                </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="modern-card mb-12">
                <div className="p-6 border-b border-white/5 bg-white/5 flex flex-wrap items-center justify-between gap-4">
                    <div className="relative w-72">
                        <MagnifyingGlass weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search active clients..."
                            className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white placeholder:text-white/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Client Identity</th>
                                <th>National ID</th>
                                <th>Regional Location</th>
                                <th className="text-center">Current Stage</th>
                                <th>Last Updated</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <AnimatePresence mode="popLayout">
                            <motion.tbody layout>
                                {filteredClients.length === 0 ? (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key="empty"
                                    >
                                        <td colSpan={6} className="text-center py-12 text-[#8a8d98] italic">
                                            No clients found in the registry.
                                        </td>
                                    </motion.tr>
                                ) : (
                                    filteredClients.map((client: Client) => (
                                        <motion.tr
                                            key={client.id}
                                            layout
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                            className="cursor-pointer hover:bg-white/5"
                                            onClick={() => navigate(`/admin/clients/${client.id}`)}
                                        >
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0 ring-1 ring-primary/20">
                                                        {client.full_name.charAt(0)}
                                                    </div>
                                                    <span className="text-white font-bold">{client.full_name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col">
                                                    <span className="text-muted-foreground text-xs font-mono">{client.national_id}</span>
                                                    {client.passport_number && (
                                                        <span className="text-primary text-[9px] font-mono mt-0.5">PSP: {client.passport_number}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col">
                                                    <span className="text-white text-xs font-bold">{client.county}</span>
                                                    {client.constituency && (
                                                        <span className="text-[10px] text-[#8a8d98] lowercase italic tracking-tight">
                                                            {client.constituency}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${client.current_stage === 'registered' ? 'bg-white/5 text-muted-foreground' :
                                                    client.current_stage === 'ielts' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        client.current_stage === 'school_application' ? 'bg-blue-500/10 text-blue-500' :
                                                            client.current_stage === 'visa' ? 'bg-primary/10 text-primary' :
                                                                'bg-green-500/10 text-green-500'
                                                    }`}>
                                                    {client.current_stage.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="text-[#8a8d98] text-xs font-medium">
                                                    {format(new Date(client.updated_at), "dd MMM yyyy")}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => navigate(`/admin/clients/${client.id}`)}
                                                    className="p-2.5 rounded-xl bg-primary/10 text-primary transition-all duration-300"
                                                >
                                                    <TrendUp weight="duotone" className="w-4 h-4" />
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </motion.tbody>
                        </AnimatePresence>
                    </table>
                </div>
            </motion.div>

            {/* Footer */}
            <motion.div variants={itemVariants} className="py-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Ron's Consultancy</span>
                    <span className="text-[10px] text-[#8a8d98]">Centralized Management Engine v2.0.4</span>
                </div>
                <div className="text-[10px] text-[#8a8d98]">
                    © {new Date().getFullYear()} Ron's Consultancy. Advanced Logistics & Education Services.
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
