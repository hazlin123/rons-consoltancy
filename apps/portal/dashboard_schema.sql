-- Rons Admin Portal Schema
-- Target: Supabase / PostgreSQL

-- 1. Enums
CREATE TYPE student_category AS ENUM ('New IELTS', 'Pre-existing IELTS', 'Visa Application');
CREATE TYPE ielts_status AS ENUM ('Done', 'Not Done');

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

-- 3. Geography Hierarchy (Optional but recommended for data integrity)
CREATE TABLE IF NOT EXISTS counties (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS constituencies (
    id SERIAL PRIMARY KEY,
    county_id INTEGER REFERENCES counties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    UNIQUE(county_id, name)
);

CREATE TABLE IF NOT EXISTS wards (
    id SERIAL PRIMARY KEY,
    constituency_id INTEGER REFERENCES constituencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    UNIQUE(constituency_id, name)
);

-- 4. Sample Geography Data
INSERT INTO counties (name) VALUES 
('Nairobi'), ('Mombasa'), ('Kisumu'), ('Kiambu'), ('Nakuru')
ON CONFLICT DO NOTHING;

-- Note: You can populate constituencies and wards via the LocationSelector or manual SQL imports.
