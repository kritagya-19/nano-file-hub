-- Add share_token column for secure shareable links
ALTER TABLE public.files ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- Create index for fast lookups by share_token
CREATE INDEX IF NOT EXISTS idx_files_share_token ON public.files(share_token) WHERE share_token IS NOT NULL;

-- Add RLS policy for public access to shared files (via share_token)
CREATE POLICY "Anyone can view public shared files"
ON public.files FOR SELECT
USING (is_public = true AND share_token IS NOT NULL);

-- Add storage policy to allow public access to shared files
CREATE POLICY "Public can download shared files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-files' 
  AND EXISTS (
    SELECT 1 FROM public.files 
    WHERE files.storage_path = objects.name 
    AND files.is_public = true 
    AND files.share_token IS NOT NULL
  )
);