-- Create employee users directly in auth.users
-- Note: This will create the base auth users. Passwords will need to be set separately.

-- First, let's ensure we have the trigger to auto-create profiles
CREATE OR REPLACE FUNCTION public.handle_new_employee()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into employees table when a user with @internal.store email is created
  IF NEW.email LIKE '%@internal.store' THEN
    INSERT INTO public.employees (user_id, name, username, email, chat_access_enabled, is_active)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      split_part(NEW.email, '@', 1),
      NEW.email,
      true,
      true
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for new auth users
DROP TRIGGER IF EXISTS on_auth_employee_created ON auth.users;
CREATE TRIGGER on_auth_employee_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_employee();

-- Function to assign admin role to employee
CREATE OR REPLACE FUNCTION public.assign_admin_role(_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Get user_id from email
  SELECT id INTO _user_id
  FROM auth.users
  WHERE email = _email;
  
  IF _user_id IS NOT NULL THEN
    -- Insert admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;