import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Scholarship, ScholarshipCategory } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  X,
  GraduationCap,
  Sparkles,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

const scholarshipSchema = z.object({
  title: z.string().min(5, "Title too short"),
  university: z.string().min(2, "University required"),
  country: z.string().min(2, "Country required"),
  countryCode: z.string().length(2, "ISO code required (e.g. GB)"),
  deadline: z.string(),
  amount: z.string().min(1, "Amount description required"),
  category: z.string(),
  description: z.string().min(20, "Description too short"),
  requirements: z.string(), // We'll split this by newlines/commas
  slots: z.coerce.number().min(1),
  featured: z.boolean().default(false),
});

export default function ScholarshipEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const isNew = id === "new";

  const form = useForm<z.infer<typeof scholarshipSchema>>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      title: "",
      university: "",
      country: "",
      countryCode: "GB",
      deadline: new Date().toISOString().split('T')[0],
      amount: "",
      category: "Masters",
      description: "",
      requirements: "",
      slots: 1,
      featured: false,
    },
  });

  useEffect(() => {
    if (!isNew) {
      const fetchScholarship = async () => {
        const { data } = await supabase
          .from('scholarships')
          .select('*')
          .eq('id', id)
          .single();

        if (data) {
          form.reset({
            ...data,
            requirements: data.requirements?.join("\n") || "",
          });
        }
      };
      fetchScholarship();
    }
  }, [id, isNew, form]);

  const onSubmit = async (values: z.infer<typeof scholarshipSchema>) => {
    setIsLoading(true);
    try {
      const scholarshipData = {
        title: values.title,
        university: values.university,
        country: values.country,
        country_code: values.countryCode,
        deadline: values.deadline,
        amount: values.amount,
        category: values.category,
        description: values.description,
        requirements: values.requirements.split("\n").filter(r => r.trim() !== ""),
        slots: values.slots,
        featured: values.featured,
      };

      if (isNew) {
        const { error } = await supabase.from('scholarships').insert([scholarshipData]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('scholarships').update(scholarshipData).eq('id', id);
        if (error) throw error;
      }

      toast.success(isNew ? "Scholarship created!" : "Scholarship updated!");
      navigate("/admin/scholarships");
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/scholarships">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-primary font-display italic">
              {isNew ? "Create Scholarship" : "Edit Scholarship"}
            </h2>
            <p className="text-slate-500">Form entry for global education opportunities.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/scholarships">
            <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold">
              Cancel
            </Button>
          </Link>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="h-12 px-8 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg shadow-primary/20 gap-2"
          >
            <Save className="w-4 h-4" /> {isLoading ? "Saving..." : "Save Opportunity"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Main Title Info */}
            <div className="md:col-span-12 space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-bold">Scholarship Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Oxford Global Excellence Fellowship" className="h-14 text-lg bg-slate-50/50 border-gray-100 focus-visible:ring-secondary/30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-6 space-y-8">
              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-bold">Institution / University</FormLabel>
                    <FormControl>
                      <Input placeholder="University of Oxford" className="h-12 bg-slate-50/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-bold">Country</FormLabel>
                      <FormControl>
                        <Input placeholder="United Kingdom" className="h-12 bg-slate-50/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-bold">ISO Code</FormLabel>
                      <FormControl>
                        <Input placeholder="GB" className="h-12 bg-slate-50/50 uppercase" maxLength={2} {...field} />
                      </FormControl>
                      <FormDescription className="text-[10px]">2-letter code</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="md:col-span-6 space-y-8">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-bold">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-slate-50/50">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="Masters">Masters</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                        <SelectItem value="Vocational">Vocational</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-bold">Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-12 bg-slate-50/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-bold">Slots</FormLabel>
                      <FormControl>
                        <Input type="number" className="h-12 bg-slate-50/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="md:col-span-12">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-bold">Funding Amount / Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Tuition + £15,000 Stipend" className="h-12 bg-slate-50/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-12">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary font-bold">Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Explain the scholarship's focus and impact..." className="min-h-[120px] bg-slate-50/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-12">
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center mb-1">
                      <FormLabel className="text-primary font-bold">Eligibility Requirements</FormLabel>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">One per line</span>
                    </div>
                    <FormControl>
                      <Textarea placeholder="IELTS 7.5+&#10;GPA 3.8+&#10;leadership potential..." className="min-h-[120px] bg-slate-50/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-12 p-6 bg-secondary/5 rounded-2xl border border-secondary/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm"><Sparkles className="w-5 h-5 text-secondary" /></div>
                <div>
                  <div className="text-sm font-bold text-primary italic">Featured Opportunity</div>
                  <p className="text-[11px] text-slate-500">Promote this scholarship to the homepage bento grid.</p>
                </div>
              </div>
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-5 h-5 accent-secondary cursor-pointer"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="pt-8 flex justify-center sticky bottom-0 bg-white pb-4">
            <Button type="submit" disabled={isLoading} className="w-64 h-16 bg-primary hover:bg-primary/95 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-primary/30 gap-3">
              <Save className="w-5 h-5 text-secondary" /> {isLoading ? "Saving..." : "Finalize Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
