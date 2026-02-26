-- ============================================
-- Data Migration Script
-- Migrate existing students table to new client journey system
-- ============================================

-- STEP 0: Auto-fix missing National IDs (GENERATE FAKE IDS)
-- ============================================
-- This ensures the migration doesn't fail due to NOT NULL constraints
-- We use a 99-prefix followed by sequential numbers to avoid conflicts
UPDATE students 
SET national_id = '99' || LPAD(sub.seq::TEXT, 6, '0')
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as seq
    FROM students 
    WHERE national_id IS NULL
) as sub
WHERE students.id = sub.id AND students.national_id IS NULL;

-- STEP 1: Migrate students to clients table
-- ============================================
INSERT INTO clients (full_name, national_id, county, constituency, ward, current_stage, created_at)
SELECT 
    full_name,
    national_id,
    county,
    constituency,
    ward,
    -- Determine current stage based on category
    CASE 
        WHEN category::TEXT = 'New IELTS' THEN 'ielts'
        WHEN category::TEXT = 'Pre-existing IELTS' THEN 'school_application'
        WHEN category::TEXT = 'School App' THEN 'school_application'
        WHEN category::TEXT = 'Visa Application' THEN 'visa'
        ELSE 'registered'
    END as current_stage,
    created_at
FROM students
ON CONFLICT (national_id) DO NOTHING;

-- STEP 2: Create IELTS registrations for relevant clients
-- ============================================
INSERT INTO ielts_registrations (client_id, registration_type, status, created_at)
SELECT 
    c.id as client_id,
    -- Determine registration type
    CASE 
        WHEN s.category::TEXT = 'New IELTS' THEN 'new'
        ELSE 'existing'
    END as registration_type,
    -- Determine status
    CASE 
        WHEN s.ielts_status::TEXT = 'Done' THEN 'completed'
        WHEN s.ielts_status::TEXT = 'Not Done' THEN 'pending'
        ELSE 'pending'
    END as status,
    s.created_at
FROM students s
JOIN clients c ON c.national_id = s.national_id
WHERE s.category::TEXT IN ('New IELTS', 'Pre-existing IELTS', 'School App')
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check migration results
SELECT 
    'Total Clients' as metric,
    COUNT(*) as count
FROM clients
UNION ALL
SELECT 
    'Total IELTS Registrations' as metric,
    COUNT(*) as count
FROM ielts_registrations
UNION ALL
SELECT 
    'Clients at IELTS Stage' as metric,
    COUNT(*) as count
FROM clients
WHERE current_stage = 'ielts'
UNION ALL
SELECT 
    'Clients at School Application Stage' as metric,
    COUNT(*) as count
FROM clients
WHERE current_stage = 'school_application';

-- Show stage distribution
SELECT 
    current_stage,
    COUNT(*) as client_count
FROM clients
GROUP BY current_stage
ORDER BY client_count DESC;

-- Count fake IDs generated
SELECT 
    'Fake IDs Assigned' as metric,
    COUNT(*) as count
FROM students
WHERE national_id LIKE '99%';

-- Detailed list of students with generated IDs (for your records)
SELECT 
    full_name as student_name,
    national_id as assigned_fake_id,
    category
FROM students
WHERE national_id LIKE '99%';

-- ============================================
-- TROUBLESHOOTING & SOLUTIONS
-- ============================================

-- OPTION A: Fix the records in the students table first
-- Run this for each skipped student to add their ID:
-- UPDATE students SET national_id = 'NUMBER' WHERE full_name = 'NAME';

-- OPTION B: Migrate records with a temporary placeholder (Not Recommended)
-- If you want to force migrate them anyway, you can use a placeholder pattern:
/*
INSERT INTO clients (full_name, national_id, county, constituency, ward, current_stage, created_at)
SELECT 
    full_name,
    'MISSING-' || id::TEXT, -- Temporary unique placeholder
    county,
    constituency,
    ward,
    CASE 
        WHEN category::TEXT = 'New IELTS' THEN 'ielts'
        WHEN category::TEXT = 'Pre-existing IELTS' THEN 'school_application'
        WHEN category::TEXT = 'School App' THEN 'school_application'
        WHEN category::TEXT = 'Visa Application' THEN 'visa'
        ELSE 'registered'
    END,
    created_at
FROM students
WHERE national_id IS NULL;
*/
