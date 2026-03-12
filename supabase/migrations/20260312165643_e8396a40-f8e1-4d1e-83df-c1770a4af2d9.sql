
-- Create message_reads table to track who has seen each message
CREATE TABLE public.message_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.group_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  read_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id)
);

-- Enable RLS
ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;

-- RLS: Members can view reads for messages in their groups
CREATE POLICY "Members can view message reads" ON public.message_reads
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.group_messages gm
      WHERE gm.id = message_reads.message_id
      AND is_group_member(auth.uid(), gm.group_id)
    )
  );

-- RLS: Authenticated users can mark messages as read
CREATE POLICY "Users can mark messages as read" ON public.message_reads
  FOR INSERT TO public
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.group_messages gm
      WHERE gm.id = message_reads.message_id
      AND is_group_member(auth.uid(), gm.group_id)
    )
  );

-- Index for fast lookups
CREATE INDEX idx_message_reads_message_id ON public.message_reads(message_id);
CREATE INDEX idx_message_reads_user_id ON public.message_reads(user_id);
