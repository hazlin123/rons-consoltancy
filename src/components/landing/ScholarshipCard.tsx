import { Scholarship } from "@/types";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ScholarshipCardProps {
    scholarship: Scholarship;
}

export const ScholarshipCard = ({ scholarship }: ScholarshipCardProps) => {
    return (
        <Card className="group overflow-hidden border-none rounded-3xl shadow-soft hover:shadow-hover transition-all duration-500 bg-white flex flex-col h-full transform hover:-translate-y-1">
            {/* Header/Image Area */}
            <CardHeader className="p-0 relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />

                {/* Visual Placeholder/Icon */}
                <div className="flex items-center justify-center h-full bg-primary/5 group-hover:scale-110 transition-transform duration-700">
                    <GraduationCap className="w-16 h-16 text-primary/20" />
                </div>

                {/* Country Badge */}
                <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-white/90 backdrop-blur-md text-foreground border-none rounded-lg py-1.5 px-3 flex gap-2 items-center shadow-sm">
                        {scholarship.countryCode && (
                            <img
                                src={`https://flagcdn.com/w20/${scholarship.countryCode.toLowerCase()}.png`}
                                alt={scholarship.country}
                                className="w-4 h-3 rounded-[2px]"
                            />
                        )}
                        <span className="text-xs font-bold">{scholarship.country}</span>
                    </Badge>
                </div>

                {/* Category Floating */}
                <div className="absolute top-4 right-4 z-20">
                    <Badge variant="secondary" className="rounded-lg bg-primary text-white border-none py-1.5 px-3 shadow-md">
                        {scholarship.category}
                    </Badge>
                </div>

                {scholarship.featured && (
                    <div className="absolute bottom-4 left-4 z-20">
                        <div className="bg-secondary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                            Featured
                        </div>
                    </div>
                )}
            </CardHeader>

            <CardContent className="p-6 md:p-8 flex-grow">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg text-slate-500 text-[10px] font-bold uppercase tracking-wider border border-slate-100">
                        <MapPin className="w-3 h-3" />
                        {scholarship.university}
                    </div>
                </div>

                <h3 className="text-2xl font-black text-foreground mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {scholarship.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 font-medium leading-relaxed">
                    {scholarship.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Scholarship Amount</span>
                        <span className="text-xl font-black text-primary">{scholarship.amount}</span>
                    </div>

                    <Link to={`/scholarships/${scholarship.id}`}>
                        <Button size="icon" className="h-12 w-12 rounded-2xl bg-slate-50 text-primary hover:bg-primary hover:text-white transition-all shadow-none">
                            <ArrowRight className="w-6 h-6" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};
