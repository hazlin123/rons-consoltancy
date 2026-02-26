// ============================================
// TypeScript Types for Client Journey System
// ============================================

export type ClientStage = 'registered' | 'ielts' | 'school_application' | 'visa' | 'completed';

export type IELTSRegistrationType = 'new' | 'existing';

export type IELTSStatus = 'pending' | 'completed' | 'cancelled';

export type SchoolApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export type VisaStatus = 'pending' | 'approved' | 'rejected' | 'interview_scheduled';

// ============================================
// Database Table Interfaces
// ============================================

export interface Client {
    id: string;
    full_name: string;
    national_id: string;
    passport_number?: string | null;
    email?: string;
    phone?: string;
    county?: string;
    constituency?: string;
    ward?: string;
    current_stage: ClientStage;
    created_at: string;
    updated_at: string;
}

export interface IELTSRegistration {
    id: string;
    client_id: string;
    registration_type: IELTSRegistrationType;

    // For new IELTS
    exam_date?: string;
    test_center?: string;

    // For existing IELTS
    existing_score?: number;
    existing_test_date?: string;
    certificate_url?: string;

    status: IELTSStatus;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface School {
    id: string;
    name: string;
    country: string;
    city?: string;
    program_types: string[];
    requirements?: string;
    tuition_range?: string;
    application_fee?: number;
    website_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface SchoolApplication {
    id: string;
    client_id: string;
    school_id: string;
    program_type: string;
    intake_term?: string;
    status: SchoolApplicationStatus;
    application_date: string;
    decision_date?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface VisaApplication {
    id: string;
    client_id: string;
    school_application_id?: string;
    visa_type: string;
    country: string;
    status: VisaStatus;
    application_date: string;
    interview_date?: string;
    decision_date?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

// ============================================
// Extended Types with Relations
// ============================================

export interface ClientWithJourney extends Client {
    ielts_registration?: IELTSRegistration;
    school_applications?: (SchoolApplication & { school: School })[];
    visa_application?: VisaApplicationWithDetails;
}

export interface SchoolApplicationWithDetails extends SchoolApplication {
    client: Client;
    school: School;
}

export interface IELTSRegistrationWithClient extends IELTSRegistration {
    client: Client;
}

export interface VisaApplicationWithDetails extends VisaApplication {
    client: Client;
    school_application?: SchoolApplication & { school: School };
}

// ============================================
// Form Data Types
// ============================================

export interface ClientFormData {
    full_name: string;
    national_id: string;
    passport_number?: string | null;
    email?: string;
    phone?: string;
    county?: string;
    constituency?: string;
    ward?: string;
}

export interface IELTSFormData {
    client_id: string;
    registration_type: IELTSRegistrationType;
    exam_date?: string | null;
    test_center?: string | null;
    existing_score?: number | null;
    existing_test_date?: string | null;
    certificate_url?: string | null;
    notes?: string | null;
}

export interface SchoolFormData {
    name: string;
    country: string;
    city?: string;
    program_types: string[];
    requirements?: string;
    tuition_range?: string;
    application_fee?: number;
    website_url?: string;
}

export interface SchoolApplicationFormData {
    client_id: string;
    school_id: string;
    program_type: string;
    intake_term?: string | null;
    notes?: string | null;
}

export interface VisaApplicationFormData {
    client_id: string;
    school_application_id?: string | null;
    visa_type: string;
    country: string;
    interview_date?: string | null;
    notes?: string | null;
}

// ============================================
// Dashboard Stats Types
// ============================================

export interface ClientJourneyStats {
    total_clients: number;
    registered: number;
    at_ielts_stage: number;
    at_school_stage: number;
    at_visa_stage: number;
    at_completed_stage: number;
    ielts_pending: number;
    ielts_completed: number;
    school_apps_pending: number;
    school_apps_accepted: number;
    visa_pending: number;
    visa_approved: number;
}

export interface StageMetrics {
    stage: ClientStage;
    count: number;
    percentage: number;
}
