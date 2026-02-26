-- Fix RLS policies for students table to allow deletions
-- Run this in Supabase SQL Editor

-- 1. Drop all existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON students;
DROP POLICY IF EXISTS "Allow public access" ON students;
DROP POLICY IF EXISTS "Enable read access for all users" ON students;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON students;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON students;

-- 2. Create permissive policies for all operations
-- This allows anyone to perform any operation (suitable for admin portal)
CREATE POLICY "Allow all operations" ON students
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Alternative: If you want to restrict to authenticated users only, use this instead:
-- CREATE POLICY "Allow all for authenticated" ON students
--     FOR ALL
--     TO authenticated
--     USING (true)
--     WITH CHECK (true);
