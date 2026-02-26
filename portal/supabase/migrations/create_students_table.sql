-- Admin Portal Students Table
-- This table is separate from the main profiles/student_journeys schema
-- and is used specifically for the admin portal's student recruitment tracking

-- 1. Create enums only if they don't exist
DO $$ BEGIN
    CREATE TYPE student_category AS ENUM ('New IELTS', 'Pre-existing IELTS', 'Visa Application', 'School App');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ielts_status AS ENUM ('Done', 'Not Done');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    category student_category NOT NULL,
    ielts_status ielts_status,
    county TEXT,
    constituency TEXT,
    ward TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policy if it exists and create new one
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON students;
CREATE POLICY "Enable all operations for authenticated users" ON students
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_students_county ON students(county);
CREATE INDEX IF NOT EXISTS idx_students_category ON students(category);
