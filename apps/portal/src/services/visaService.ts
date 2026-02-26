import { supabase } from "@rons/utils";
import type {
    VisaApplication,
    VisaApplicationFormData,
    VisaApplicationWithDetails
} from "../types/clientJourney";

/**
 * Visa Service - Handles visa application operations
 */
export const visaService = {
    /**
     * Get all visa applications for a client
     */
    async getClientVisas(clientId: string): Promise<VisaApplicationWithDetails[]> {
        const { data, error } = await supabase
            .from("visa_applications")
            .select(`
                *,
                client:clients(*),
                school_application:school_applications(
                    *,
                    school:schools(*)
                )
            `)
            .eq("client_id", clientId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Flatten relationship arrays
        return (data || []).map(visa => ({
            ...visa,
            client: Array.isArray(visa.client) ? visa.client[0] : visa.client,
            school_application: Array.isArray(visa.school_application)
                ? visa.school_application[0]
                : visa.school_application
        })) as VisaApplicationWithDetails[];
    },

    /**
     * Get all visa applications with optional status filter
     */
    async getAllVisas(status?: string): Promise<VisaApplicationWithDetails[]> {
        let query = supabase
            .from("visa_applications")
            .select(`
                *,
                client:clients(*),
                school_application:school_applications(
                    *,
                    school:schools(*)
                )
            `)
            .order("created_at", { ascending: false });

        if (status) {
            query = query.eq("status", status);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Flatten relationship arrays
        return (data || []).map(visa => ({
            ...visa,
            client: Array.isArray(visa.client) ? visa.client[0] : visa.client,
            school_application: Array.isArray(visa.school_application)
                ? visa.school_application[0]
                : visa.school_application
        })) as VisaApplicationWithDetails[];
    },

    /**
     * Create new visa application
     */
    async createVisaApplication(visaData: VisaApplicationFormData): Promise<VisaApplication> {
        const { data, error } = await supabase
            .from("visa_applications")
            .insert([visaData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update visa application
     */
    async updateVisa(id: string, updates: Partial<VisaApplicationFormData>): Promise<VisaApplication> {
        const { data, error } = await supabase
            .from("visa_applications")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update visa status
     */
    async updateVisaStatus(id: string, status: string, decisionDate?: string): Promise<VisaApplication> {
        const updates: any = { status };
        if (decisionDate) {
            updates.decision_date = decisionDate;
        }

        const { data, error } = await supabase
            .from("visa_applications")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete visa application
     */
    async deleteVisa(id: string): Promise<void> {
        const { error } = await supabase
            .from("visa_applications")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
};
