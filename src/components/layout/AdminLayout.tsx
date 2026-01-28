import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronRight,
    Menu,
    X,
    Shield
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";

export const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/admin/dashboard" },
        { icon: Users, label: "Students", href: "/admin/management" },
        { icon: GraduationCap, label: "Scholarships", href: "/admin/scholarships" },
        { icon: Settings, label: "Settings", href: "/admin/settings" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/auth/login");
    };

    return (
        <div className="flex min-h-screen bg-background font-sans">
            {/* Admin Sidebar - Dark Red Palette */}
            <aside
                className={`fixed left-0 top-0 h-screen bg-primary text-white z-50 transition-all duration-300 border-r border-white/5 shadow-2xl ${isSidebarOpen ? "w-72" : "w-20"} dark:bg-card dark:border-border`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-24 flex items-center px-6 border-b border-white/5">
                        <Link to="/admin/dashboard" className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 shadow-lg shadow-black/20">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            {isSidebarOpen && (
                                <div className="flex flex-col">
                                    <span className="font-display font-black text-xl tracking-tighter leading-none text-secondary italic">ADMIN</span>
                                    <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.3em] font-sans">Future Bridge</span>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-grow py-10 px-4 space-y-3">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative overflow-hidden ${isActive
                                        ? "bg-secondary text-primary font-bold shadow-xl shadow-black/20"
                                        : "text-white/60 hover:text-secondary hover:bg-white/5"
                                        }`}
                                >
                                    <item.icon className={`w-6 h-6 shrink-0 transition-colors ${isActive ? "text-primary" : "group-hover:text-secondary"}`} />
                                    {isSidebarOpen && (
                                        <span className="text-sm uppercase tracking-wider font-extrabold">{item.label}</span>
                                    )}
                                    {isActive && isSidebarOpen && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-6 border-t border-white/5">
                        <div className={`flex items-center gap-4 bg-black/20 p-4 rounded-[1.5rem] border border-white/5 ${!isSidebarOpen && "justify-center"}`}>
                            <Avatar className="h-10 w-10 border-2 border-secondary/30 shrink-0">
                                <AvatarFallback className="bg-secondary text-primary font-bold">{user?.name?.charAt(0) || "A"}</AvatarFallback>
                            </Avatar>
                            {isSidebarOpen && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-display font-black text-white truncate italic tracking-tight">{user?.name || "Admin User"}</p>
                                    <p className="text-[9px] text-secondary/40 uppercase tracking-[0.3em] font-bold">System Curator</p>
                                </div>
                            )}
                            {isSidebarOpen && (
                                <button
                                    onClick={handleLogout}
                                    className="p-2 bg-white/5 hover:bg-red-500/20 rounded-xl text-red-400 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-20"}`}>
                {/* Admin Top Header - Cream Accents */}
                <header className="h-24 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-[#F1F5F9] dark:border-border sticky top-0 z-40 px-10 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-3 bg-[#F1F5F9] text-primary rounded-2xl hover:bg-primary/5 transition-colors shadow-sm"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div className="h-8 w-px bg-slate-200 hidden md:block" />
                        <div className="hidden lg:flex flex-col">
                            <h2 className="text-lg font-black text-primary tracking-tight leading-none italic uppercase">Dashboard</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Management Overview</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center bg-[#F9FAFB] dark:bg-muted border border-[#F1F5F9] dark:border-border rounded-2xl px-5 py-3 w-[450px] shadow-sm focus-within:ring-2 ring-primary/5 transition-all">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input
                                placeholder="Search students, scholarships, operations..."
                                className="bg-transparent border-none focus:ring-0 text-xs w-full ml-4 font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <ModeToggle />
                            <div className="h-10 w-px bg-slate-200" />
                            <button className="relative p-3 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all duration-500 shadow-sm">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white shadow-soft" />
                            </button>
                            <div className="h-10 w-px bg-slate-200" />
                            <Link to="/">
                                <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:bg-primary/5 rounded-2xl px-6">
                                    Live Site
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content Page Outlet */}
                <main className="p-10 lg:p-14">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
