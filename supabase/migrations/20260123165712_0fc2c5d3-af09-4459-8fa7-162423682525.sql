-- Fix groups table policies - make them PERMISSIVE
DROP POLICY IF EXISTS "Users can create their own groups" ON public.groups;
CREATE POLICY "Users can create their own groups"
ON public.groups FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- Also ensure the trigger function has proper permissions
CREATE OR REPLACE FUNCTION public.handle_new_group()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_group_created ON public.groups;
CREATE TRIGGER on_group_created
  AFTER INSERT ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_group();