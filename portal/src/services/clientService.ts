import { supabase } from "@rons/utils";
import type {
    Client,
    ClientFormData,
    ClientWithJourney,
    ClientJourneyStats,
    StageMetrics
} from "../types/clientJourney";

/**
 * Client Service - Handles all client-related database operations
 */
export const clientService = {
    /**
     * Get all clients with optional filtering
     */
    async getAllClients(stage?: string): Promise<Client[]> {
        let query = supabase
            .from("clients")
            .select("*")
            .order("created_at", { ascending: false });

        if (stage) {
            query = query.eq("current_stage", stage);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    },

    /**
     * Get a single client by ID with full journey details
     */
    async getClientById(id: string): Promise<ClientWithJourney | null> {
        const { data, error } = await supabase
            .from("clients")
            .select(`
                *,
                ielts_registration:ielts_registrations(*),
                school_applications(
                    *,
                    school:schools(*)
                ),
                visa_application:visa_applications(
                    *,
                    school_application:school_applications(
                        *,
                        school:schools(*)
                    )
                )
            `)
            .eq("id", id)
            .single();

        if (error) throw error;
        if (!data) return null;

        // Flatten Supabase relationship arrays
        const clientWithDetails = {
            ...data,
            ielts_registration: Array.isArray(data.ielts_registration)
                ? data.ielts_registration[0]
                : data.ielts_registration,
            visa_application: Array.isArray(data.visa_application)
                ? data.visa_application[0]
                : data.visa_application
        };

        // Flatten nested visa -> school_app relation
        if (clientWithDetails.visa_application && Array.isArray(clientWithDetails.visa_application.school_application)) {
            clientWithDetails.visa_application.school_application = clientWithDetails.visa_application.school_application[0];
        }

        return clientWithDetails as ClientWithJourney;
    },

    /**
     * Create a new client
     */
    async createClient(clientData: ClientFormData): Promise<Client> {
        const { data, error } = await supabase
            .from("clients")
            .insert([clientData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update client information
     */
    async updateClient(id: string, updates: Partial<ClientFormData>): Promise<Client> {
        const { data, error } = await supabase
            .from("clients")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update client's current stage
     */
    async updateClientStage(id: string, stage: string): Promise<Client> {
        const { data, error } = await supabase
            .from("clients")
            .update({ current_stage: stage })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a client (cascades to all related records)
     */
    async deleteClient(id: string): Promise<void> {
        const { error } = await supabase
            .from("clients")
            .delete()
            .eq("id", id);

        if (error) throw error;
    },

    /**
     * Get dashboard statistics
     */
    async getJourneyStats(): Promise<ClientJourneyStats> {
        // Get total clients by stage
        const { data: clients } = await supabase
            .from("clients")
            .select("current_stage");

        // Get IELTS stats
        const { data: ieltsData } = await supabase
            .from("ielts_registrations")
            .select("status");

        // Get school application stats
        const { data: schoolApps } = await supabase
            .from("school_applications")
            .select("status");

        // Get visa stats
        const { data: visas } = await supabase
            .from("visa_applications")
            .select("status");

        const total_clients = clients?.length || 0;
        const registered = clients?.filter(c => c.current_stage === 'registered').length || 0;
        const at_ielts_stage = clients?.filter(c => c.current_stage === 'ielts').length || 0;
        const at_school_stage = clients?.filter(c => c.current_stage === 'school_application').length || 0;
        const at_visa_stage = clients?.filter(c => c.current_stage === 'visa').length || 0;
        const at_completed_stage = clients?.filter(c => c.current_stage === 'completed').length || 0;

        const ielts_pending = ieltsData?.filter(i => i.status === 'pending').length || 0;
        const ielts_completed = ieltsData?.filter(i => i.status === 'completed').length || 0;

        const school_apps_pending = schoolApps?.filter(s => s.status === 'pending').length || 0;
        const school_apps_accepted = schoolApps?.filter(s => s.status === 'accepted').length || 0;

        const visa_pending = visas?.filter(v => v.status === 'pending').length || 0;
        const visa_approved = visas?.filter(v => v.status === 'approved').length || 0;

        return {
            total_clients,
            registered,
            at_ielts_stage,
            at_school_stage,
            at_visa_stage,
            at_completed_stage,
            ielts_pending,
            ielts_completed,
            school_apps_pending,
            school_apps_accepted,
            visa_pending,
            visa_approved
        };
    },

    /**
     * Get stage distribution metrics
     */
    async getStageMetrics(): Promise<StageMetrics[]> {
        const { data, error } = await supabase
            .from("clients")
            .select("current_stage");

        if (error) throw error;

        const total = data?.length || 0;
        const stageCounts: Record<string, number> = {};

        data?.forEach(client => {
            stageCounts[client.current_stage] = (stageCounts[client.current_stage] || 0) + 1;
        });

        return Object.entries(stageCounts).map(([stage, count]) => ({
            stage: stage as any,
            count,
            percentage: total > 0 ? (count / total) * 100 : 0
        }));
    },

    /**
     * Search clients by name or national ID
     */
    async searchClients(query: string): Promise<Client[]> {
        const { data, error } = await supabase
            .from("clients")
            .select("*")
            .or(`full_name.ilike.%${query}%,national_id.ilike.%${query}%`)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data || [];
    }
};
