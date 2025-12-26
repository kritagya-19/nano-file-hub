-- Create enum for group member roles
CREATE TYPE public.group_role AS ENUM ('owner', 'admin', 'member');

-- Create groups table
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group_members table
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role group_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create group_files table (for sharing files to groups)
CREATE TABLE public.group_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, file_id)
);

-- Create group_messages table for real-time chat
CREATE TABLE public.group_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;

-- Helper function to check if user is a member of a group
CREATE OR REPLACE FUNCTION public.is_group_member(_user_id UUID, _group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE user_id = _user_id AND group_id = _group_id
  )
$$;

-- Helper function to check if user is group admin or owner
CREATE OR REPLACE FUNCTION public.is_group_admin(_user_id UUID, _group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE user_id = _user_id AND group_id = _group_id AND role IN ('owner', 'admin')
  )
$$;

-- Groups policies
CREATE POLICY "Users can view groups they are members of"
ON public.groups FOR SELECT
USING (public.is_group_member(auth.uid(), id));

CREATE POLICY "Authenticated users can create groups"
ON public.groups FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Group admins can update groups"
ON public.groups FOR UPDATE
USING (public.is_group_admin(auth.uid(), id));

CREATE POLICY "Group owners can delete groups"
ON public.groups FOR DELETE
USING (auth.uid() = owner_id);

-- Group members policies
CREATE POLICY "Members can view group members"
ON public.group_members FOR SELECT
USING (public.is_group_member(auth.uid(), group_id));

CREATE POLICY "Group admins can add members"
ON public.group_members FOR INSERT
WITH CHECK (public.is_group_admin(auth.uid(), group_id) OR auth.uid() = user_id);

CREATE POLICY "Group admins can update members"
ON public.group_members FOR UPDATE
USING (public.is_group_admin(auth.uid(), group_id));

CREATE POLICY "Group admins can remove members or members can leave"
ON public.group_members FOR DELETE
USING (public.is_group_admin(auth.uid(), group_id) OR auth.uid() = user_id);

-- Group files policies
CREATE POLICY "Members can view group files"
ON public.group_files FOR SELECT
USING (public.is_group_member(auth.uid(), group_id));

CREATE POLICY "Members can share files to group"
ON public.group_files FOR INSERT
WITH CHECK (public.is_group_member(auth.uid(), group_id) AND auth.uid() = shared_by);

CREATE POLICY "File sharer or admins can remove shared files"
ON public.group_files FOR DELETE
USING (auth.uid() = shared_by OR public.is_group_admin(auth.uid(), group_id));

-- Group messages policies
CREATE POLICY "Members can view group messages"
ON public.group_messages FOR SELECT
USING (public.is_group_member(auth.uid(), group_id));

CREATE POLICY "Members can send messages"
ON public.group_messages FOR INSERT
WITH CHECK (public.is_group_member(auth.uid(), group_id) AND auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
ON public.group_messages FOR DELETE
USING (auth.uid() = user_id);

-- Add username to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'username') THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
  END IF;
END $$;

-- Trigger to automatically add owner as member when group is created
CREATE OR REPLACE FUNCTION public.handle_new_group()
RETURNS TRIGGER
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

CREATE TRIGGER on_group_created
  AFTER INSERT ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_group();

-- Trigger for updated_at
CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();