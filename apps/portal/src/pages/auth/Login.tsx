import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@rons/utils";
import { motion } from "framer-motion";
import {
    Envelope,
    LockKey,
    SignIn,
    WarningCircle,
    Sparkle,
    CircleNotch
} from "@phosphor-icons/react";
import { toast } from "sonner";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    // Redirect if already logged in
    const from = location.state?.from?.pathname || "/admin/dashboard";

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            await login(email, password);
            toast.success("Welcome back to the portal.");
            // Navigation handled by useEffect
        } catch (err: any) {
            console.error("Login Failed:", err);
            setError(err.message || "Invalid credentials. Please try again.");
            toast.error("Authentication failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-accent/5 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] p-8 md:p-12">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 rotate-3"
                        >
                            <img src="/logo-gold.png" alt="Logo" className="w-10 h-10 object-contain" />
                        </motion.div>
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                            Admin <span className="text-primary">Portal</span>
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium">
                            Secure access for consultancy management
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-3 border border-red-100"
                        >
                            <WarningCircle weight="bold" className="w-5 h-5 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground pl-1">Email Address</label>
                            <div className="relative group">
                                <Envelope weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-white/20"
                                    placeholder="admin@rons.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground pl-1">Password</label>
                            <div className="relative group">
                                <LockKey weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-white/20"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <CircleNotch weight="bold" className="w-5 h-5 animate-spin" />
                            ) : (
                                <SignIn weight="bold" className="w-5 h-5" />
                            )}
                            {isLoading ? "Authenticating..." : "Sign In to Dashboard"}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <p className="text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-1.5">
                            <Sparkle weight="duotone" className="w-3 h-3 text-primary" />
                            Protected by Ron's Security Engine
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
