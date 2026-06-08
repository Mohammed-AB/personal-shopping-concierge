-- Update store hours
UPDATE public.store_settings
SET store_hours = '{
  "monday": {"open": "10:00", "close": "20:00", "closed": false},
  "tuesday": {"open": "10:00", "close": "20:00", "closed": false},
  "wednesday": {"open": "10:00", "close": "20:00", "closed": false},
  "thursday": {"open": "10:00", "close": "20:00", "closed": false},
  "friday": {"open": "10:00", "close": "20:00", "closed": false},
  "saturday": {"open": "10:00", "close": "20:00", "closed": false},
  "sunday": {"open": "12:00", "close": "18:00", "closed": false}
}'::jsonb;