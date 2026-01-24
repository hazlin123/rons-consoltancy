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
    X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/admin/dashboard" },
        { icon: Users, label: "Student Management", href: "/admin/management" },
        { icon: GraduationCap, label: "Scholarships", href: "/admin/scholarships" },
        { icon: Settings, label: "Settings", href: "/admin/settings" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/auth/login");
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">

            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex w-72 bg-primary flex-col border-r border-white/10 text-white">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-display font-bold text-xl italic leading-none">Rons IELTS</span>
                </div>

                <nav className="flex-grow px-4 space-y-2 py-6">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                to={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-secondary text-primary font-bold shadow-lg shadow-secondary/10"
                                    : "text-primary-foreground/60 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "group-hover:text-secondary"} transition-colors`} />
                                {item.label}
                                {isActive && <ChevronRight className="ml-auto w-4 h-4" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto border-t border-white/5">
                    <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-secondary/30">
                            <AvatarFallback className="bg-secondary text-primary font-bold">AD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{user?.name || "Admin User"}</p>
                            <p className="text-[10px] text-primary-foreground/40 uppercase tracking-widest font-bold">Senior Auditor</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* Top Header */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6 text-primary" />
                        </button>
                        <span className="font-display font-bold text-xl italic text-primary">Rons IELTS</span>
                    </div>

                    <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 w-96 group focus-within:ring-2 ring-secondary/20 transition-all">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input placeholder="Global search..." className="bg-transparent border-none focus:ring-0 text-sm w-full ml-3" />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
                        </button>
                        <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block" />
                        <div className="sm:flex flex-col items-end hidden">
                            <span className="text-sm font-bold text-primary">{user?.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Admin Portal</span>
                        </div>
                    </div>
                </header>

                {/* Content Page Outlet */}
                <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                    <div className="max-w-7xl mx-auto mb-20">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <aside className="absolute top-0 left-0 bottom-0 w-72 bg-primary text-white p-8">
                        <div className="flex justify-between items-center mb-12">
                            <span className="font-display font-bold text-xl italic">Rons IELTS</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
                        </div>
                        <nav className="space-y-4">
                            {menuItems.map(item => (
                                <Link key={item.label} to={item.href} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10" onClick={() => setIsMobileMenuOpen(false)}>
                                    <item.icon className="w-5 h-5 text-secondary" /> {item.label}
                                </Link>
                            ))}
                            <button onClick={handleLogout} className="flex items-center gap-4 p-4 text-red-400 w-full hover:bg-red-500/10 rounded-xl mt-12">
                                <LogOut className="w-5 h-5" /> Logout
                            </button>
                        </nav>
                    </aside>
                </div>
            )}

        </div>
    );
};
