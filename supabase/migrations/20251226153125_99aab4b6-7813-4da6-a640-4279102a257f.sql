-- Drop the restrictive insert policy for groups
DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.groups;

-- Create a permissive insert policy that allows any authenticated user to create groups
-- The owner_id check ensures they set themselves as owner
CREATE POLICY "Authenticated users can create groups"
ON public.groups FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- Also need to update group_members insert policy to allow the trigger to work
-- The trigger runs as SECURITY DEFINER so it bypasses RLS, but let's ensure members can join
DROP POLICY IF EXISTS "Group admins can add members" ON public.group_members;

-- Allow admins to add members OR allow the owner trigger to work (via security definer)
-- Also allow users to join via the join_group_by_code function
CREATE POLICY "Group admins can add members or self-join"
ON public.group_members FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow if user is an admin of the group
  public.is_group_admin(auth.uid(), group_id) 
  -- OR allow users to add themselves (for joining via invite code)
  OR auth.uid() = user_id
);