-- Add is_starred column to group_messages for starring messages
ALTER TABLE public.group_messages ADD COLUMN is_starred BOOLEAN NOT NULL DEFAULT false;

-- Add starred_by to track who starred the message (for personal starring)
ALTER TABLE public.group_messages ADD COLUMN starred_by UUID[] DEFAULT '{}';

-- Create index for faster starred message queries
CREATE INDEX idx_group_messages_starred ON public.group_messages USING GIN (starred_by);

-- Allow users to update their own messages (for starring)
CREATE POLICY "Users can update their own messages"
ON public.group_messages FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() = ANY(starred_by))
WITH CHECK (auth.uid() = user_id OR auth.uid() = ANY(starred_by));