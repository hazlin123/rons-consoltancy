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
        <div className="flex min-h-screen bg-[#F9FAFB] font-sans">
            {/* Left Sidebar - Dark Red Palette */}
            <aside
                className={`fixed left-0 top-0 h-screen bg-primary text-white z-50 transition-all duration-300 border-r border-white/5 shadow-2xl ${isSidebarOpen ? "w-64" : "w-20"}`}
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
                                    <span className="font-black text-sm tracking-tighter leading-none text-secondary">RON'S</span>
                                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest italic lowercase">IELTS Portal</span>
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
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl w-96 border border-slate-200/50 focus-within:ring-2 ring-primary/5 transition-all shadow-inner">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search courses, tests, results..."
                            className="bg-transparent border-none text-sm focus:outline-none w-full text-slate-600 font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-secondary/20 hover:shadow-soft rounded-xl transition-all relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white" />
                            </button>
                            <Link to="/">
                                <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-secondary/20 hover:shadow-soft rounded-xl transition-all shadow-sm">
                                    <Home className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>

                        <div className="h-8 w-px bg-slate-200" />

                        <div className="flex items-center gap-3 border border-primary/5 p-1.5 rounded-2xl bg-slate-50 shadow-sm">
                            <div className="text-right hidden sm:block pl-2">
                                <div className="text-xs font-black text-slate-900 leading-none mb-1 uppercase tracking-tighter italic">{user?.name}</div>
                                <div className="text-[10px] font-bold text-primary uppercase tracking-wider italic">Student Member</div>
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
