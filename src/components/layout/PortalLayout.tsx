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
    Home
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const PortalLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

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
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Top Professional Banner */}
            <div className="bg-primary text-white py-2 px-4 text-center text-[10px] font-black uppercase tracking-[0.2em]">
                Official British IELTS Council Student Portal
            </div>

            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link to="/portal/dashboard" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg tracking-tighter leading-none">RON'S PORTAL</span>
                            <span className="text-[10px] font-bold text-primary italic lowercase">journey tracker</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={`text-sm font-black uppercase tracking-widest transition-all ${isActive ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground hover:text-primary"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
                        </button>
                        <div className="h-8 w-px bg-gray-100 mx-2" />
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="bg-primary text-white font-bold">{user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:block">
                                <div className="text-xs font-black text-foreground leading-none mb-1 uppercase tracking-tighter">{user?.name}</div>
                                <div className="text-[10px] font-bold text-primary italic">My Progress</div>
                            </div>
                            <Button onClick={handleLogout} variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 hover:bg-red-50">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Portal Main Area */}
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>

            {/* Floating Home Button for Students to go back to Public Site if needed */}
            <Link
                to="/"
                className="fixed bottom-8 left-8 p-4 bg-white rounded-2xl shadow-hover border border-gray-100 text-primary hover:scale-110 transition-all z-50 flex items-center gap-2 group"
            >
                <Home className="w-5 h-5" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black text-xs uppercase tracking-widest">Public Site</span>
            </Link>
        </div>
    );
};
