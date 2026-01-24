-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;

-- Create a new INSERT policy that allows:
-- 1. Users uploading to their own folder (userId/...)
-- 2. Group members uploading to group-chat folder (group-chat/groupId/...)
CREATE POLICY "Users can upload files" ON storage.objects
FOR INSERT TO public
WITH CHECK (
  bucket_id = 'user-files' 
  AND auth.uid() IS NOT NULL
  AND (
    -- Users can upload to their own folder
    (auth.uid())::text = (storage.foldername(name))[1]
    OR
    -- Users can upload to group-chat folders (any authenticated user can upload to group chat)
    (storage.foldername(name))[1] = 'group-chat'
  )
);

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;

-- Create a new SELECT policy that allows:
-- 1. Users viewing their own files
-- 2. Authenticated users viewing group-chat files
CREATE POLICY "Users can view files" ON storage.objects
FOR SELECT TO public
USING (
  bucket_id = 'user-files'
  AND auth.uid() IS NOT NULL
  AND (
    -- Users can view their own files
    (auth.uid())::text = (storage.foldername(name))[1]
    OR
    -- Authenticated users can view group-chat files
    (storage.foldername(name))[1] = 'group-chat'
  )
);

-- Keep the public download policy for shared files as is