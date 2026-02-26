import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@rons/utils";
import {
    SquaresFour,
    Users,
    ClipboardText,
    ChartBar,
    Gear,
    Bell,
    SignOut,
    User,
    Question,
    X,
    CaretRight,
    MagnifyingGlass,
    List,
    Buildings,
    Airplane
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showHelp, setShowHelp] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const menuItems = [
        { icon: SquaresFour, label: "Dashboard", path: "/admin/dashboard", shortcut: "Alt+D" },
        { icon: Users, label: "Clients", path: "/admin/clients", shortcut: "Alt+C" },
        { icon: ClipboardText, label: "IELTS", path: "/admin/ielts", shortcut: "Alt+I" },
        { icon: Buildings, label: "Institutions", path: "/admin/institutions", shortcut: "Alt+N" },
        { icon: Buildings, label: "School Apps", path: "/admin/school-apps", shortcut: "Alt+A" },
        { icon: Airplane, label: "Visa Processing", path: "/admin/visa", shortcut: "Alt+V" },
    ];

    return (
        <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className={`modern-sidebar transition-all duration-500 z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Brand */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-8 pb-12 flex items-center gap-4"
                    >
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(84,172,191,0.3)] ring-2 ring-primary/30">
                            <img
                                src="/logo-gold.png"
                                alt="Ron's Consultancy"
                                className="w-10 h-10 object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight leading-tight text-white">Ron's<br /><span className="text-primary">Admin</span></h1>
                        </div>
                    </motion.div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 px-4 space-y-2">
                        <div className="px-4 mb-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Main Menu</span>
                        </div>
                        {menuItems.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <motion.div
                                    key={item.path}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        to={item.path}
                                        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                            ? 'bg-primary text-primary-foreground shadow-[0_8px_20px_-4px_rgba(84,172,191,0.3)]'
                                            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <item.icon weight="duotone" className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                            <span className="text-sm font-bold">{item.label}</span>
                                        </div>
                                        {isActive && (
                                            <motion.div layoutId="activePointer">
                                                <CaretRight weight="bold" className="w-4 h-4 opacity-50" />
                                            </motion.div>
                                        )}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer / User Profile */}
                    <div className="p-4 mt-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="modern-glass rounded-3xl p-4 flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                                <User weight="duotone" className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold truncate text-foreground">Administrator</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase truncate">Super Admin</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                                title="Sign Out"
                            >
                                <SignOut weight="bold" className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
                {/* Top Header */}
                <header className="modern-header">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <MagnifyingGlass weight="bold" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-2.5 text-xs focus:bg-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all w-64 lg:w-96 text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowHelp(!showHelp)}
                            className="p-3 modern-glass rounded-2xl text-muted-foreground hover:text-white hover:border-white/20 transition-all"
                            title="Help Center"
                        >
                            <Question weight="duotone" className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 modern-glass rounded-2xl text-muted-foreground hover:text-white hover:border-white/20 transition-all relative"
                        >
                            <Bell weight="duotone" className="w-5 h-5" />
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent border-2 border-[#FDF8F4] rounded-full shadow-[0_0_8px_rgba(243,195,178,0.8)] animate-pulse"></span>
                        </motion.button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Help Overlay */}
            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
                        onClick={() => setShowHelp(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="modern-card p-10 max-w-2xl w-full relative overflow-visible"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowHelp(false)}
                                className="absolute -top-4 -right-4 w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl z-10"
                            >
                                <X className="w-6 h-6" />
                            </motion.button>

                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-black mb-1">Command <span className="text-primary">Center</span></h2>
                                    <p className="text-sm text-muted-foreground font-medium tracking-wide italic">"Efficiency is doing things right; effectiveness is doing the right things."</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            Shortcuts
                                        </h3>
                                        <div className="space-y-2">
                                            {menuItems.map((item) => (
                                                <div key={item.path} className="flex items-center justify-between p-3 modern-glass rounded-xl border-dashed">
                                                    <span className="text-xs font-bold text-white/80">{item.label}</span>
                                                    <span className="text-[10px] font-black px-2 py-0.5 bg-primary/20 text-primary rounded-md">{item.shortcut}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            Advanced Tools
                                        </h3>
                                        <ul className="space-y-3">
                                            <li className="text-[11px] text-[#8a8d98] font-bold flex items-center gap-3">
                                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                                Deep CSV Export with real-time filters
                                            </li>
                                            <li className="text-[11px] text-[#8a8d98] font-bold flex items-center gap-3">
                                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                                Live Database Synchronization
                                            </li>
                                            <li className="text-[11px] text-[#8a8d98] font-bold flex items-center gap-3">
                                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                                System Integrity Assurance Log
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase">Support Instance</span>
                                    <span className="text-xs font-bold text-white">support-engine-01@rons.com</span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowHelp(!showHelp)}
                                    className="modern-button-primary py-3 px-8"
                                >
                                    Dismiss Portal
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLayout;
