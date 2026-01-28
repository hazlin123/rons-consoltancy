
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GraduationCap, ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function ResetPassword() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: values.password
            });
            if (error) throw error;
            toast.success("Password updated successfully!");
            navigate("/auth/login");
        } catch (error: any) {
            toast.error(error.message || "Failed to update password.");
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
                        Secure your account with a new strong password and continue your journey.
                    </p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-24 justify-center">
                <div className="max-w-md w-full mx-auto">
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold text-primary mb-3 font-display">New Password</h2>
                        <p className="text-muted-foreground">Create a new secure password for your account.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary font-semibold">New Password</FormLabel>
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
                                        <FormLabel className="text-primary font-semibold">Confirm Password</FormLabel>
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
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
