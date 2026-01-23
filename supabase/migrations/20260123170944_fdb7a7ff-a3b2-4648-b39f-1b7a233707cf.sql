-- Drop the foreign key constraint that references auth.users
-- This is causing the RLS violation because the anon/authenticated role 
-- cannot access auth.users table for the FK check
ALTER TABLE public.groups DROP CONSTRAINT groups_owner_id_fkey;