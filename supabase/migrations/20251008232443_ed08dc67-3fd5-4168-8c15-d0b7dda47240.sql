-- First, let's create a function to handle user creation properly
CREATE OR REPLACE FUNCTION create_employee_with_auth(
  p_username TEXT,
  p_name TEXT,
  p_password TEXT,
  p_role app_role
) RETURNS void AS $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
BEGIN
  v_email := p_username || '@internal.store';
  
  -- This is a placeholder - actual user creation must be done via Supabase Admin API
  -- For now, we'll just create the employee record structure
  -- The actual auth user must be created through the Supabase dashboard or Admin API
  
  -- Create a placeholder UUID for now
  v_user_id := gen_random_uuid();
  
  -- Insert into employees table
  INSERT INTO public.employees (user_id, name, username, email, chat_access_enabled, is_active)
  VALUES (v_user_id, p_name, p_username, v_email, true, true)
  ON CONFLICT (username) DO NOTHING;
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;