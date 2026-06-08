-- Make username column nullable temporarily to fix existing data
ALTER TABLE public.employees ALTER COLUMN username DROP NOT NULL;

-- Add a default value for existing rows
UPDATE public.employees SET username = split_part(email, '@', 1) WHERE username IS NULL;