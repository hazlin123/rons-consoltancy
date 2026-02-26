import { supabase } from "@rons/utils";
import { format, subDays, startOfDay } from "date-fns";

export interface DashboardStats {
    totalStudents: number;
    activeIelts: number;
    visaProcessing: number;
    admissions: number;
}

export interface RegistrationTrend {
    name: string;
    val: number;
}

export interface RegionalDistribution {
    name: string;
    value: number;
}

export const dashboardService = {
    async getDashboardStats(): Promise<DashboardStats> {
        // Query the `clients` table (migrated from `students`)
        const { count: totalStudents } = await supabase
            .from("clients")
            .select("*", { count: "exact", head: true });

        const { count: activeIelts } = await supabase
            .from("clients")
            .select("*", { count: "exact", head: true })
            .eq("current_stage", "ielts");

        const { count: visaProcessing } = await supabase
            .from("clients")
            .select("*", { count: "exact", head: true })
            .eq("current_stage", "visa");

        const { count: admissions } = await supabase
            .from("clients")
            .select("*", { count: "exact", head: true })
            .eq("current_stage", "school_application");

        return {
            totalStudents: totalStudents || 0,
            activeIelts: activeIelts || 0,
            visaProcessing: visaProcessing || 0,
            admissions: admissions || 0,
        };
    },

    async getRegistrationTrends(): Promise<RegistrationTrend[]> {
        const days = 7;
        const trends: RegistrationTrend[] = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const start = startOfDay(date).toISOString();
            const end = new Date(startOfDay(date).getTime() + 86400000 - 1).toISOString();

            const { count } = await supabase
                .from("clients")
                .select("*", { count: "exact", head: true })
                .gte("created_at", start)
                .lte("created_at", end);

            trends.push({
                name: format(date, "EEE"),
                val: count || 0,
            });
        }

        return trends;
    },

    async getRegionalDistribution(): Promise<RegionalDistribution[]> {
        const { data } = await supabase.from("clients").select("county");

        if (!data) return [];

        const distribution: Record<string, number> = {};
        data.forEach((client) => {
            const county = client.county || "Unknown";
            distribution[county] = (distribution[county] || 0) + 1;
        });

        return Object.entries(distribution).map(([name, value]) => ({
            name,
            value,
        }));
    },

    async getStudentRecords() {
        const { data } = await supabase
            .from("clients")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(10);

        return data || [];
    },
};
