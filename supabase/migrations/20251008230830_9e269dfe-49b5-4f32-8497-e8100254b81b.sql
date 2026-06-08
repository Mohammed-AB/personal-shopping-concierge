-- Add username column to employees table
ALTER TABLE public.employees
ADD COLUMN username TEXT UNIQUE;

-- Update employees table to make username required for new entries
ALTER TABLE public.employees
ALTER COLUMN username SET NOT NULL;