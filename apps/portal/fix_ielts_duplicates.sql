-- ============================================
-- Fix IELTS Duplication & Enforce Uniqueness
-- ============================================

-- 1. Identify and delete duplicate IELTS registrations
-- We keep only the most recent registration per client
DELETE FROM ielts_registrations
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY created_at DESC) as row_num
        FROM ielts_registrations
    ) t
    WHERE t.row_num > 1
);

-- 2. Add UNIQUE constraint to client_id in ielts_registrations
-- This prevents future duplicates at the database level
ALTER TABLE ielts_registrations
ADD CONSTRAINT unique_client_ielts UNIQUE (client_id);

-- 3. Verify the changes
SELECT client_id, COUNT(*) 
FROM ielts_registrations 
GROUP BY client_id 
HAVING COUNT(*) > 1;

-- 4. Unify data by ensuring all students are in clients (Safety check)
INSERT INTO clients (full_name, national_id, county, constituency, ward, current_stage, created_at)
SELECT 
    full_name,
    national_id,
    county,
    constituency,
    ward,
    CASE 
        WHEN category::TEXT = 'New IELTS' THEN 'ielts'
        WHEN category::TEXT IN ('Pre-existing IELTS', 'School App') THEN 'school_application'
        WHEN category::TEXT = 'Visa Application' THEN 'visa'
        ELSE 'registered'
    END,
    created_at
FROM students
ON CONFLICT (national_id) DO NOTHING;
