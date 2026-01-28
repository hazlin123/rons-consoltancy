
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GraduationCap, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });
            if (error) throw error;
            setIsSubmitted(true);
            toast.success("Reset link sent!");
        } catch (error: any) {
            toast.error(error.message || "Failed to send reset email.");
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
                        Don't worry, even the best scholars forget sometimes. Let's get you back on track.
                    </p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-24 justify-center">
                <div className="max-w-md w-full mx-auto">
                    <Link to="/auth/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-12 transition-colors">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back to login
                    </Link>

                    {!isSubmitted ? (
                        <>
                            <div className="mb-12">
                                <h2 className="text-4xl font-bold text-primary mb-3 font-display">Forgot Password?</h2>
                                <p className="text-muted-foreground">Enter your email address and we'll send you a link to reset your password.</p>
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

                                    <Button type="submit" className="w-full h-14 bg-primary text-white hover:bg-primary/95 text-lg font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                                        {isLoading ? "Sending link..." : "Send Reset Link"}
                                    </Button>
                                </form>
                            </Form>
                        </>
                    ) : (
                        <div className="text-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4 italic">Email Sent!</h3>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                We've sent a password reset link to <span className="font-bold text-primary">{form.getValues().email}</span>. Please check your inbox and follow the instructions.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full h-14 rounded-2xl border-slate-200 font-bold"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Didn't receive it? Try again
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
