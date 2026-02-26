import { supabase } from "@rons/utils";
import type {
    IELTSRegistration,
    IELTSRegistrationWithClient,
    IELTSFormData
} from "../types/clientJourney";

/**
 * IELTS Service - Handles IELTS registration operations
 */
export const ieltsService = {
    /**
     * Get all IELTS registrations for a client
     */
    async getClientIELTS(clientId: string): Promise<IELTSRegistration[]> {
        const { data, error } = await supabase
            .from("ielts_registrations")
            .select("*")
            .eq("client_id", clientId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get all IELTS registrations with optional status filter
     */
    async getAllIELTS(status?: string): Promise<IELTSRegistrationWithClient[]> {
        let query = supabase
            .from("ielts_registrations")
            .select(`
                *,
                client:clients(*)
            `)
            .order("created_at", { ascending: false });

        if (status) {
            query = query.eq("status", status);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    },

    /**
     * Create new IELTS registration
     * Ensures only one registration exists per client
     */
    async createIELTS(ieltsData: IELTSFormData): Promise<IELTSRegistration> {
        // First check if a registration already exists for this client
        const existing = await this.getClientIELTS(ieltsData.client_id);
        if (existing.length > 0) {
            // Update the existing one instead of creating a new one
            return this.updateIELTS(existing[0].id, ieltsData);
        }

        const { data, error } = await supabase
            .from("ielts_registrations")
            .insert([ieltsData])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                // Fallback to update if check failed for some reason
                const latest = await this.getClientIELTS(ieltsData.client_id);
                if (latest.length > 0) return this.updateIELTS(latest[0].id, ieltsData);
            }
            throw error;
        }
        return data;
    },

    /**
     * Update IELTS registration
     */
    async updateIELTS(id: string, updates: Partial<IELTSFormData>): Promise<IELTSRegistration> {
        const { data, error } = await supabase
            .from("ielts_registrations")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update IELTS status
     */
    async updateIELTSStatus(id: string, status: string): Promise<IELTSRegistration> {
        const { data, error } = await supabase
            .from("ielts_registrations")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete IELTS registration
     */
    async deleteIELTS(id: string): Promise<void> {
        const { error } = await supabase
            .from("ielts_registrations")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
};
