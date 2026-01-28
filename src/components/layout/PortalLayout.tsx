import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
    Trophy,
    Calendar,
    BookOpen,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Bell,
    Home,
    Search,
    ChevronRight
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";

export const PortalLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/portal/dashboard" },
        { icon: Calendar, label: "Classes", href: "/portal/classes" },
        { icon: BookOpen, label: "Assignments", href: "/portal/assignments" },
        { icon: Trophy, label: "Mock Tests", href: "/portal/tests" },
        { icon: CreditCard, label: "Tuition", href: "/portal/tuition" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="flex min-h-screen bg-background font-sans">
            {/* Left Sidebar - Dark Red Palette */}
            <aside
                className={`fixed left-0 top-0 h-screen bg-primary text-white z-50 transition-all duration-300 border-r border-white/5 shadow-2xl ${isSidebarOpen ? "w-64" : "w-20"} dark:bg-card dark:border-border`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-20 flex items-center px-6 border-b border-white/5">
                        <Link to="/portal/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 shadow-lg shadow-black/20">
                                <Trophy className="w-5 h-5 text-primary" />
                            </div>
                            {isSidebarOpen && (
                                <div className="flex flex-col">
                                    <span className="font-display font-black text-base tracking-tighter leading-none text-secondary italic">RONS</span>
                                    <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.3em] font-sans">Future Bridge</span>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-grow py-8 px-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                        ? "bg-secondary text-primary font-bold shadow-lg shadow-black/10"
                                        : "text-white/60 hover:text-secondary hover:bg-white/5"
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : "group-hover:text-secondary"}`} />
                                    {isSidebarOpen && (
                                        <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                    )}
                                    {isActive && isSidebarOpen && (
                                        <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-white/5">
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-red-500/20 transition-all ${!isSidebarOpen && "justify-center px-0"}`}
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                            {isSidebarOpen && <span className="text-sm font-bold tracking-tight">Log Out</span>}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                {/* Top Header */}
                <header className="h-20 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-slate-200 dark:border-border sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-muted px-4 py-2 rounded-xl w-96 border border-slate-200/50 dark:border-border focus-within:ring-2 ring-primary/5 transition-all shadow-inner">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search courses, tests, results..."
                            className="bg-transparent border-none text-sm focus:outline-none w-full text-slate-600 dark:text-slate-300 font-medium placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <ModeToggle />
                            <button className="p-3 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all duration-500 relative shadow-sm">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white shadow-soft" />
                            </button>
                            <Link to="/">
                                <button className="p-3 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all duration-500 shadow-sm">
                                    <Home className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>

                        <div className="h-8 w-px bg-slate-200" />

                        <div className="flex items-center gap-4 p-2 pr-4 rounded-2xl bg-primary/5 border border-primary/5 shadow-soft">
                            <div className="text-right hidden sm:block pl-2">
                                <div className="text-xs font-display font-black text-primary leading-none mb-1 italic tracking-tight uppercase">{user?.name}</div>
                                <div className="text-[9px] font-bold text-primary/40 uppercase tracking-[0.2em]">Student Member</div>
                            </div>
                            <Avatar className="h-9 w-9 border-2 border-white shadow-soft">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="bg-primary text-secondary font-bold">{user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
