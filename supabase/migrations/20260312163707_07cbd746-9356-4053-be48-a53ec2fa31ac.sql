
-- Add reply_to column to group_messages for reply-to-message feature
ALTER TABLE public.group_messages ADD COLUMN reply_to uuid REFERENCES public.group_messages(id) ON DELETE SET NULL;

-- Create message_reactions table for emoji reactions
CREATE TABLE public.message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.group_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emoji text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);

-- Enable RLS
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for message_reactions
CREATE POLICY "Members can view reactions" ON public.message_reactions
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.group_messages gm
      WHERE gm.id = message_reactions.message_id
      AND is_group_member(auth.uid(), gm.group_id)
    )
  );

CREATE POLICY "Members can add reactions" ON public.message_reactions
  FOR INSERT TO public
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.group_messages gm
      WHERE gm.id = message_reactions.message_id
      AND is_group_member(auth.uid(), gm.group_id)
    )
  );

CREATE POLICY "Users can remove own reactions" ON public.message_reactions
  FOR DELETE TO public
  USING (auth.uid() = user_id);

-- Index for fast reaction lookups
CREATE INDEX idx_message_reactions_message_id ON public.message_reactions(message_id);
