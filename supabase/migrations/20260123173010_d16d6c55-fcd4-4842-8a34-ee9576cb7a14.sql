-- Add attachment columns to group_messages table
ALTER TABLE public.group_messages
ADD COLUMN IF NOT EXISTS file_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS file_name TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS file_type TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS file_size INTEGER DEFAULT NULL;

-- Create index for faster queries on messages with files
CREATE INDEX IF NOT EXISTS idx_group_messages_file ON public.group_messages(group_id) WHERE file_url IS NOT NULL;