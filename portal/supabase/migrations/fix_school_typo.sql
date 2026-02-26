-- Fix typo: "Reach Community Collage" → "Reach Community College"
UPDATE schools
SET name = 'Reach Community College'
WHERE name = 'Reach Community Collage';
