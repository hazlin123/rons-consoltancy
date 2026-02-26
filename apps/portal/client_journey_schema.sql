-- ============================================
-- Client Journey Management System - Database Schema
-- Phase 1: Create all tables and relationships
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CLIENTS TABLE (Main Entity)
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    national_id TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    county TEXT,
    constituency TEXT,
    ward TEXT,
    current_stage TEXT DEFAULT 'registered' CHECK (current_stage IN ('registered', 'ielts', 'school_application', 'visa')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. IELTS REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ielts_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    registration_type TEXT NOT NULL CHECK (registration_type IN ('new', 'existing')),
    
    -- For new IELTS registrations
    exam_date DATE,
    test_center TEXT,
    
    -- For existing IELTS
    existing_score DECIMAL(3,1),
    existing_test_date DATE,
    certificate_url TEXT,
    
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. SCHOOLS TABLE (Admin-managed catalog)
-- ============================================
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT,
    program_types TEXT[], -- ['Undergraduate', 'Masters', 'PhD', 'Diploma']
    requirements TEXT,
    tuition_range TEXT,
    application_fee DECIMAL(10,2),
    website_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. SCHOOL APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS school_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id),
    program_type TEXT NOT NULL,
    intake_term TEXT, -- 'Fall 2024', 'Spring 2025', 'January 2025'
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    application_date DATE DEFAULT CURRENT_DATE,
    decision_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. VISA APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS visa_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    school_application_id UUID REFERENCES school_applications(id),
    visa_type TEXT DEFAULT 'Student Visa',
    country TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'interview_scheduled')),
    application_date DATE DEFAULT CURRENT_DATE,
    interview_date DATE,
    decision_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Clients indexes
CREATE INDEX IF NOT EXISTS idx_clients_current_stage ON clients(current_stage);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_national_id ON clients(national_id);

-- IELTS registrations indexes
CREATE INDEX IF NOT EXISTS idx_ielts_client_id ON ielts_registrations(client_id);
CREATE INDEX IF NOT EXISTS idx_ielts_status ON ielts_registrations(status);
CREATE INDEX IF NOT EXISTS idx_ielts_registration_type ON ielts_registrations(registration_type);

-- Schools indexes
CREATE INDEX IF NOT EXISTS idx_schools_country ON schools(country);
CREATE INDEX IF NOT EXISTS idx_schools_is_active ON schools(is_active);

-- School applications indexes
CREATE INDEX IF NOT EXISTS idx_school_apps_client_id ON school_applications(client_id);
CREATE INDEX IF NOT EXISTS idx_school_apps_school_id ON school_applications(school_id);
CREATE INDEX IF NOT EXISTS idx_school_apps_status ON school_applications(status);

-- Visa applications indexes
CREATE INDEX IF NOT EXISTS idx_visa_apps_client_id ON visa_applications(client_id);
CREATE INDEX IF NOT EXISTS idx_visa_apps_status ON visa_applications(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ielts_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin access)
CREATE POLICY "Enable all operations for authenticated users" ON clients
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" ON ielts_registrations
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" ON schools
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" ON school_applications
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users" ON visa_applications
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ielts_updated_at BEFORE UPDATE ON ielts_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_apps_updated_at BEFORE UPDATE ON school_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visa_apps_updated_at BEFORE UPDATE ON visa_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample schools
INSERT INTO schools (name, country, city, program_types, tuition_range, is_active) VALUES
('University of Toronto', 'Canada', 'Toronto', ARRAY['Undergraduate', 'Masters', 'PhD'], '$30,000 - $50,000/year', true),
('McGill University', 'Canada', 'Montreal', ARRAY['Undergraduate', 'Masters', 'PhD'], '$25,000 - $45,000/year', true),
('University of British Columbia', 'Canada', 'Vancouver', ARRAY['Undergraduate', 'Masters', 'PhD'], '$28,000 - $48,000/year', true),
('University of Melbourne', 'Australia', 'Melbourne', ARRAY['Undergraduate', 'Masters', 'PhD'], 'AUD $35,000 - $55,000/year', true),
('University of Sydney', 'Australia', 'Sydney', ARRAY['Undergraduate', 'Masters', 'PhD'], 'AUD $38,000 - $58,000/year', true)
ON CONFLICT DO NOTHING;
