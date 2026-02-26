-- Add national_id column to students table
-- Run this migration to add Kenyan National ID field

ALTER TABLE students 
ADD COLUMN IF NOT EXISTS national_id TEXT;

-- Add index for national_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_national_id ON students(national_id);

-- Optional: Add unique constraint if National IDs should be unique
-- ALTER TABLE students ADD CONSTRAINT unique_national_id UNIQUE (national_id);
