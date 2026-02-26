-- Student Registration Diagnostic Script
-- Run this in the Supabase SQL Editor to check for issues

-- 1. Check current table status
SELECT 
    (SELECT count(*) FROM students) as total_students,
    (SELECT setting FROM pg_settings WHERE name = 'row_security') as rls_enabled;

-- 2. Check for any constraints or triggers on the students table
SELECT 
    conname as constraint_name, 
    contype as type, 
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'students'::regclass;

-- 3. Check RLS policies specifically
SELECT * FROM pg_policies WHERE tablename = 'students';

-- 4. Check if real-time is enabled for the table
SELECT * FROM pg_publication_tables WHERE tablename = 'students';

-- 5. Test a direct insert and see the error
-- This will show the exact database-level error if one exists
-- DO NOT RUN if you don't want to add a test record
-- INSERT INTO students (full_name, category, county, constituency) 
-- VALUES ('Diagnostic Test Student', 'New IELTS', 'Nairobi', 'Westlands');

-- 6. Ensure real-time is enabled (Fix if missing)
-- ALTER PUBLICATION supabase_realtime ADD TABLE students;
