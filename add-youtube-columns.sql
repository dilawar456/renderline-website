-- =============================================
-- ADD YOUTUBE VIDEO COLUMNS TO SITE_CONTENT
-- Run this in Supabase SQL Editor
-- =============================================

-- Add YouTube video URL columns
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS youtube_video1 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS youtube_video2 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS youtube_video3 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS youtube_video4 TEXT;

-- Add Cloudinary image URL columns
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero1 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero2 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero3 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero4 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero5 TEXT;

-- Confirm changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'site_content' 
AND column_name LIKE '%youtube%' OR column_name LIKE '%cloudinary%';
