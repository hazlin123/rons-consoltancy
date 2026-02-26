import { supabase } from "@rons/utils";
import { subDays, startOfDay } from "date-fns";

export interface AnalyticsStats {
    totalViews: number;
    uniqueVisitors: number;
}

export interface VisitTrend {
    name: string;
    views: number;
    visitors: number;
}

export const analyticsService = {
    async getVisitStats(): Promise<AnalyticsStats> {
        const { count: totalViews, error: viewsError } = await supabase
            .from("website_page_views")
            .select("*", { count: "exact", head: true });

        if (viewsError) console.error("Error fetching total views:", viewsError);

        const { data: uniqueData, error: uniqueError } = await supabase
            .from("website_page_views")
            .select("session_id");

        if (uniqueError) console.error("Error fetching unique visitors:", uniqueError);

        const uniqueSessiodIds = new Set(uniqueData?.map(item => item.session_id) || []);

        return {
            totalViews: totalViews || 0,
            uniqueVisitors: uniqueSessiodIds.size || 0,
        };
    },

    async getVisitTrends(): Promise<VisitTrend[]> {
        const days = 7;
        const trends: VisitTrend[] = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const start = startOfDay(date).toISOString();
            const end = new Date(startOfDay(date).getTime() + 86400000 - 1).toISOString();

            const { data } = await supabase
                .from("website_page_views")
                .select("session_id")
                .gte("created_at", start)
                .lte("created_at", end);

            const uniqueInDay = new Set(data?.map(item => item.session_id));

            trends.push({
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                views: data?.length || 0,
                visitors: uniqueInDay.size || 0,
            });
        }

        return trends;
    }
};
