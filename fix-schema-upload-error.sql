-- Fix Schema: Add columns for Cloudinary Images that are causing upload errors
-- Run this in Supabase SQL Editor

ALTER TABLE site_content 
ADD COLUMN IF NOT EXISTS cloudinary_hero1 TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_hero2 TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_hero3 TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_hero4 TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_hero5 TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_service1 TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_service2 TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_service3 TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_service4 TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_service5 TEXT,
ADD COLUMN IF NOT EXISTS cloudinary_service6 TEXT,
ADD COLUMN IF NOT EXISTS about_image TEXT;
