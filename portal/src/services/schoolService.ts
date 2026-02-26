import { supabase } from "@rons/utils";
import type {
    School,
    SchoolFormData,
    SchoolApplication,
    SchoolApplicationFormData,
    SchoolApplicationWithDetails
} from "../types/clientJourney";

/**
 * School Service - Handles school catalog and application operations
 */
export const schoolService = {
    // ============================================
    // SCHOOL CATALOG MANAGEMENT
    // ============================================

    /**
     * Get all schools (active only by default)
     */
    async getAllSchools(includeInactive = false): Promise<School[]> {
        let query = supabase
            .from("schools")
            .select("*")
            .order("name");

        if (!includeInactive) {
            query = query.eq("is_active", true);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    },

    /**
     * Get school by ID
     */
    async getSchoolById(id: string): Promise<School | null> {
        const { data, error } = await supabase
            .from("schools")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Create new school
     */
    async createSchool(schoolData: SchoolFormData): Promise<School> {
        const { data, error } = await supabase
            .from("schools")
            .insert([schoolData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update school
     */
    async updateSchool(id: string, updates: Partial<SchoolFormData>): Promise<School> {
        const { data, error } = await supabase
            .from("schools")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Toggle school active status
     */
    async toggleSchoolStatus(id: string, isActive: boolean): Promise<School> {
        const { data, error } = await supabase
            .from("schools")
            .update({ is_active: isActive })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete school
     */
    async deleteSchool(id: string): Promise<void> {
        const { error } = await supabase
            .from("schools")
            .delete()
            .eq("id", id);

        if (error) throw error;
    },

    // ============================================
    // SCHOOL APPLICATIONS
    // ============================================

    /**
     * Get all applications for a client
     */
    async getClientApplications(clientId: string): Promise<SchoolApplicationWithDetails[]> {
        const { data, error } = await supabase
            .from("school_applications")
            .select(`
                *,
                client:clients(*),
                school:schools(*)
            `)
            .eq("client_id", clientId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get all applications with optional status filter
     */
    async getAllApplications(status?: string): Promise<SchoolApplicationWithDetails[]> {
        let query = supabase
            .from("school_applications")
            .select(`
                *,
                client:clients(*),
                school:schools(*)
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
     * Create new school application
     */
    async createApplication(appData: SchoolApplicationFormData): Promise<SchoolApplication> {
        const { data, error } = await supabase
            .from("school_applications")
            .insert([appData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update application
     */
    async updateApplication(id: string, updates: Partial<SchoolApplicationFormData>): Promise<SchoolApplication> {
        const { data, error } = await supabase
            .from("school_applications")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update application status
     */
    async updateApplicationStatus(id: string, status: string, decisionDate?: string): Promise<SchoolApplication> {
        const updates: any = { status };
        if (decisionDate) {
            updates.decision_date = decisionDate;
        }

        const { data, error } = await supabase
            .from("school_applications")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete application
     */
    async deleteApplication(id: string): Promise<void> {
        const { error } = await supabase
            .from("school_applications")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
};
