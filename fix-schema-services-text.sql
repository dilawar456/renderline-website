-- Fix Schema: Add columns for Service Text (Titles, Descriptions, etc.)
-- Run this in Supabase SQL Editor to enable Saving Services

ALTER TABLE site_content
ADD COLUMN IF NOT EXISTS services_heading TEXT,
ADD COLUMN IF NOT EXISTS services_subheading TEXT;

ALTER TABLE site_content
ADD COLUMN IF NOT EXISTS service1_title TEXT,
ADD COLUMN IF NOT EXISTS service1_desc TEXT,
ADD COLUMN IF NOT EXISTS service1_icon TEXT,
ADD COLUMN IF NOT EXISTS service1_timeline TEXT,
ADD COLUMN IF NOT EXISTS service1_price TEXT,

ADD COLUMN IF NOT EXISTS service2_title TEXT,
ADD COLUMN IF NOT EXISTS service2_desc TEXT,
ADD COLUMN IF NOT EXISTS service2_icon TEXT,
ADD COLUMN IF NOT EXISTS service2_timeline TEXT,
ADD COLUMN IF NOT EXISTS service2_price TEXT,

ADD COLUMN IF NOT EXISTS service3_title TEXT,
ADD COLUMN IF NOT EXISTS service3_desc TEXT,
ADD COLUMN IF NOT EXISTS service3_icon TEXT,
ADD COLUMN IF NOT EXISTS service3_timeline TEXT,
ADD COLUMN IF NOT EXISTS service3_price TEXT,

ADD COLUMN IF NOT EXISTS service4_title TEXT,
ADD COLUMN IF NOT EXISTS service4_desc TEXT,
ADD COLUMN IF NOT EXISTS service4_icon TEXT,
ADD COLUMN IF NOT EXISTS service4_timeline TEXT,
ADD COLUMN IF NOT EXISTS service4_price TEXT,

ADD COLUMN IF NOT EXISTS service5_title TEXT,
ADD COLUMN IF NOT EXISTS service5_desc TEXT,
ADD COLUMN IF NOT EXISTS service5_icon TEXT,
ADD COLUMN IF NOT EXISTS service5_timeline TEXT,
ADD COLUMN IF NOT EXISTS service5_price TEXT,

ADD COLUMN IF NOT EXISTS service6_title TEXT,
ADD COLUMN IF NOT EXISTS service6_desc TEXT,
ADD COLUMN IF NOT EXISTS service6_icon TEXT,
ADD COLUMN IF NOT EXISTS service6_timeline TEXT,
ADD COLUMN IF NOT EXISTS service6_price TEXT;
