-- ============================================
-- FIX SCHOOLS TABLE PERMISSIONS AND CONSTRAINTS
-- ============================================

-- 1. Fix Foreign Key Constraint in school_applications
-- This allows deleting a school even if it has applications (DANGEROUS but ensures "Delete" works)
-- If you prefer to keep applications, change ON DELETE CASCADE to ON DELETE SET NULL
-- Note: Requires school_id to be nullable for SET NULL
ALTER TABLE school_applications DROP CONSTRAINT IF EXISTS school_applications_school_id_fkey;
ALTER TABLE school_applications 
    ADD CONSTRAINT school_applications_school_id_fkey 
    FOREIGN KEY (school_id) 
    REFERENCES schools(id) 
    ON DELETE CASCADE;

-- 2. Reset RLS Policies for Schools
-- Ensure the policy is totally permissive for the admin portal
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON schools;
DROP POLICY IF EXISTS "Allow all operations for everyone" ON schools;

CREATE POLICY "Allow all operations for everyone" ON schools
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- 3. Reset RLS Policies for School Applications (just in case they are related)
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON school_applications;
DROP POLICY IF EXISTS "Allow all operations for everyone" ON school_applications;

CREATE POLICY "Allow all operations for everyone" ON school_applications
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 4. Reset RLS Policies for Visa Applications
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON visa_applications;
DROP POLICY IF EXISTS "Allow all operations for everyone" ON visa_applications;

CREATE POLICY "Allow all operations for everyone" ON visa_applications
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 5. Reset RLS Policies for Clients (to allow stage updates)
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON clients;
DROP POLICY IF EXISTS "Allow all operations for everyone" ON clients;

CREATE POLICY "Allow all operations for everyone" ON clients
    FOR ALL
    USING (true)
    WITH CHECK (true);

ALTER TABLE school_applications ENABLE ROW LEVEL SECURITY;
