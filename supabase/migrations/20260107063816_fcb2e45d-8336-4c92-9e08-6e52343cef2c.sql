-- Drop existing RLS policies for groups table
DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.groups;
DROP POLICY IF EXISTS "Group admins can update groups" ON public.groups;
DROP POLICY IF EXISTS "Group owners can delete groups" ON public.groups;
DROP POLICY IF EXISTS "Users can view groups they are members of" ON public.groups;

-- Recreate policies as PERMISSIVE (default)
CREATE POLICY "Users can create their own groups" 
ON public.groups 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Group admins can update groups" 
ON public.groups 
FOR UPDATE 
TO authenticated
USING (is_group_admin(auth.uid(), id));

CREATE POLICY "Group owners can delete groups" 
ON public.groups 
FOR DELETE 
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Members can view their groups" 
ON public.groups 
FOR SELECT 
TO authenticated
USING (is_group_member(auth.uid(), id));