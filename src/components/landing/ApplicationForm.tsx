import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileUp, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    ieltsScore: z.string().optional(),
    statementOfPurpose: z.string().min(50, "Statement must be at least 50 characters"),
});

export const ApplicationForm = ({ scholarshipTitle }: { scholarshipTitle: string }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            ieltsScore: "",
            statementOfPurpose: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Application submitted:", values);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <Card className="border-none shadow-none bg-transparent text-center py-12">
                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-display font-black text-primary italic">Application Received!</h2>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                        Thank you for applying to the <strong>{scholarshipTitle}</strong>. Our team will review your documents and contact you within 5-7 business days.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-4">
                        New Application
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border border-white/40 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-primary text-secondary p-10 lg:p-14 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <CardTitle className="text-4xl font-display font-black mb-3 italic">Apply for Scholarship</CardTitle>
                <CardDescription className="text-secondary/60 text-lg italic tracking-wide">
                    Currently applying for: <span className="text-white font-bold">{scholarshipTitle}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 lg:p-12">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary font-semibold">Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" className="h-12 bg-slate-50" {...field} />
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
                                            <Input placeholder="john@example.com" type="email" className="h-12 bg-slate-50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary font-semibold">Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+254 720 494 322" className="h-12 bg-slate-50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ieltsScore"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary font-semibold">IELTS Score (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. 7.5" className="h-12 bg-slate-50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="statementOfPurpose"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-primary font-semibold">Statement of Purpose</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Explain why you are the ideal candidate for this scholarship..."
                                            className="min-h-[200px] bg-slate-50"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-center group hover:border-secondary/50 transition-colors cursor-pointer">
                            <FileUp className="w-12 h-12 text-slate-300 group-hover:text-secondary mb-4 transition-colors" />
                            <div className="text-primary font-bold mb-1">Upload Documents</div>
                            <p className="text-xs text-muted-foreground max-w-[200px]">
                                PDF, DOCX up to 10MB (CV, Transcripts, ID)
                            </p>
                        </div>

                        <Button type="submit" className="w-full h-18 bg-primary text-white hover:bg-primary/95 font-black text-xs uppercase tracking-[0.25em] rounded-2xl shadow-2xl shadow-primary/30 transition-all duration-500 italic">
                            Submit Application <Send className="ml-3 w-4 h-4" />
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
