-- =============================================
-- STORAGE BUCKETS SETUP & SECURITY
-- RenderLine Architecture Visualization
-- =============================================
-- Copy and paste this ENTIRE file into your Supabase SQL Editor and run it.
-- https://supabase.com/dashboard/project/_/sql/new

-- 1. Create the storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create the storage bucket for service images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Create the storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Enable RLS on objects (files)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLICIES (Who can do what)
-- =============================================

-- POLICY 1: Public Read Access (Everyone can view images)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('portfolio-images', 'service-images', 'profile-images') );

-- POLICY 2: Authenticated Upload Access (Only logged in users can upload)
-- Note: Check if the user is authenticated via Supabase Auth
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id IN ('portfolio-images', 'service-images', 'profile-images')
);

-- POLICY 3: Authenticated Update Access
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  bucket_id IN ('portfolio-images', 'service-images', 'profile-images')
);

-- POLICY 4: Authenticated Delete Access
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  bucket_id IN ('portfolio-images', 'service-images', 'profile-images')
);

-- =============================================
-- DONE
-- =============================================
