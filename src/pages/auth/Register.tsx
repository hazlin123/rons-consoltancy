import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GraduationCap, ArrowLeft, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const registerSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof registerSchema>) => {
        setIsLoading(true);
        try {
            await signUp(values.email, values.password, values.fullName);
            toast.success("Registration successful! You can now log in.");
            navigate("/auth/login");
        } catch (error: any) {
            toast.error(error.message || "Registration failed. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-24 justify-center">
                <div className="max-w-md w-full mx-auto">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-12 transition-colors">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back to home
                    </Link>

                    <div className="mb-12">
                        <h2 className="text-4xl font-bold text-primary mb-3 font-display">Create Account</h2>
                        <p className="text-muted-foreground">Join our global community of scholars today.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary font-semibold">Full Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input placeholder="John Doe" className="h-12 pl-12 bg-slate-50 border-gray-100" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary font-semibold">Email Address</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input placeholder="john@example.com" type="email" className="h-12 pl-12 bg-slate-50 border-gray-100" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-primary font-semibold">Password</FormLabel>
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

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-primary font-semibold">Confirm</FormLabel>
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
                            </div>

                            <Button type="submit" className="w-full h-14 bg-primary text-white hover:bg-primary/95 text-lg font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Register now"}
                            </Button>
                        </form>
                    </Form>

                    <p className="text-center mt-8 text-muted-foreground">
                        Already have an account? <Link to="/auth/login" className="text-primary font-black hover:underline italic">Log in</Link>
                    </p>
                </div>
            </div>

            {/* Left Side: Visual/Brand (Inverse position for variety) */}
            <div className="hidden lg:flex w-1/2 bg-slate-50 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-30">
                    <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary blur-[180px] rounded-full" />
                    <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-secondary blur-[150px] rounded-full" />
                </div>

                <div className="relative z-10 text-center max-w-md border-2 border-white/50 bg-white/20 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl">
                    <GraduationCap className="w-20 h-20 text-primary mx-auto mb-8 animate-bounce-slow" />
                    <h1 className="text-4xl font-bold text-primary mb-4 font-display italic">Start Your Journey</h1>
                    <p className="text-lg text-slate-600 leading-relaxed font-light">
                        Join 50,000+ students globally who trust Rons Future Bridge for their education funding.
                    </p>

                    <div className="mt-12 grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                            <div className="text-2xl font-bold text-primary">£15M</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Funds Awarded</div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                            <div className="text-2xl font-bold text-primary">120+</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Countries</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const style = document.createElement('style');
style.textContent = `
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
    50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
  }
  .animate-bounce-slow { animation: bounce-slow 3s infinite; }
`;
document.head.appendChild(style);
