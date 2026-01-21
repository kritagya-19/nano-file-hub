-- Drop and recreate the SELECT policy as permissive (the existing one is restrictive)
DROP POLICY IF EXISTS "Members can view their groups" ON public.groups;

CREATE POLICY "Members can view their groups"
ON public.groups
FOR SELECT
TO authenticated
USING (is_group_member(auth.uid(), id));

-- Drop and recreate UPDATE policy as permissive
DROP POLICY IF EXISTS "Group admins can update groups" ON public.groups;

CREATE POLICY "Group admins can update groups"
ON public.groups
FOR UPDATE
TO authenticated
USING (is_group_admin(auth.uid(), id));

-- Drop and recreate DELETE policy as permissive
DROP POLICY IF EXISTS "Group owners can delete groups" ON public.groups;

CREATE POLICY "Group owners can delete groups"
ON public.groups
FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);