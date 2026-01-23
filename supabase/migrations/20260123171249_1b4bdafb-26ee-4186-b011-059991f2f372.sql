-- Create a security definer function to create groups
-- This bypasses RLS and ensures proper group creation
CREATE OR REPLACE FUNCTION public.create_group(
  _name TEXT,
  _description TEXT DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _user_id UUID;
  _group_id UUID;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Create the group
  INSERT INTO public.groups (name, description, owner_id)
  VALUES (_name, _description, _user_id)
  RETURNING id INTO _group_id;
  
  RETURN _group_id;
END;
$$;