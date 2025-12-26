-- Create function to join group by invite code
CREATE OR REPLACE FUNCTION public.join_group_by_code(code TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _group_id UUID;
  _user_id UUID;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Find the group by invite code
  SELECT id INTO _group_id FROM public.groups WHERE invite_code = code;
  
  IF _group_id IS NULL THEN
    RAISE EXCEPTION 'Invalid invite code';
  END IF;
  
  -- Check if already a member
  IF EXISTS (SELECT 1 FROM public.group_members WHERE group_id = _group_id AND user_id = _user_id) THEN
    RAISE EXCEPTION 'Already a member';
  END IF;
  
  -- Add the user as a member
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (_group_id, _user_id, 'member');
  
  RETURN _group_id;
END;
$$;