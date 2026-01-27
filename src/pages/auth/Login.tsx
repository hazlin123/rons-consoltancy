import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GraduationCap, ArrowLeft, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    // Get previous path or default to '/'
    const from = location.state?.from?.pathname || "/";

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        setIsLoading(true);
        try {
            await login(values.email, values.password);
            toast.success("Welcome back!");

            if (values.email === 'eleazerlagat60@gmail.com') {
                navigate("/admin/dashboard");
            } else {
                navigate("/portal");
            }
        } catch (error: any) {
            console.error("Login Error:", error);
            if (error.message?.includes("Email not confirmed")) {
                toast.error("Please confirm your email address before logging in.");
            } else {
                toast.error(error.message || "Invalid email or password.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side: Visual/Brand */}
            <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10">
                    <div className="absolute top-1/4 right-0 w-96 h-96 bg-white blur-[150px] rounded-full" />
                    <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-secondary blur-[100px] rounded-full" />
                </div>

                <div className="relative z-10 text-center max-w-md">
                    <GraduationCap className="w-20 h-20 text-secondary mx-auto mb-8" />
                    <h1 className="text-5xl font-bold text-white mb-6 font-display italic">Rons Future Bridge</h1>
                    <p className="text-xl text-primary-foreground/70 leading-relaxed font-light">
                        Access exclusive scholarships and expert guidance to fund your global education dreams.
                    </p>
                </div>

                <div className="absolute bottom-12 left-12 flex gap-8">
                    <div className="text-white/40 text-xs tracking-widest uppercase font-bold">IELTS Affiliate</div>
                    <div className="text-white/40 text-xs tracking-widest uppercase font-bold">Global Network</div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-24 justify-center">
                <div className="max-w-md w-full mx-auto">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-12 transition-colors">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back to home
                    </Link>

                    <div className="mb-12">
                        <h2 className="text-4xl font-bold text-primary mb-3 font-display">Log in</h2>
                        <p className="text-muted-foreground">Welcome back student! Enter your details to continue.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary font-semibold">Email Address</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input placeholder="john@example.com" className="h-12 pl-12 bg-slate-50 border-gray-100" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex justify-between items-center">
                                            <FormLabel className="text-primary font-semibold">Password</FormLabel>
                                            <a href="#" className="text-sm font-medium text-secondary hover:underline">Forgot?</a>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input type="password" placeholder="••••••••" className="h-12 pl-12 bg-slate-50 border-gray-100" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full h-14 bg-primary text-white hover:bg-primary/95 text-lg font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Log in"}
                            </Button>
                        </form>
                    </Form>

                    <p className="text-center mt-8 text-muted-foreground">
                        Don't have an account? <Link to="/auth/register" className="text-secondary font-bold hover:underline">Register now</Link>
                    </p>

                </div>
            </div>
        </div>
    );
}
