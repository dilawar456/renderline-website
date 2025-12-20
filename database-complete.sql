-- =============================================
-- COMPLETE DATABASE SCHEMA (MERGED & CLEANED)
-- Run this in Supabase SQL Editor
-- This script supercedes all previous fix scripts.
-- =============================================

-- =============================================
-- 1. SITE CONTENT TABLE - ALL WEBSITE TEXT & IMAGES
-- =============================================
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    
    -- HOME PAGE - Hero
    hero_badge TEXT DEFAULT '✦ Premium 3D Visualization',
    hero_line1 TEXT DEFAULT 'High-Quality Architectural',
    hero_line2 TEXT DEFAULT 'Visualization that',
    hero_line3 TEXT DEFAULT 'Helps Architects Win Clients',
    hero_description TEXT DEFAULT 'We transform your architectural concepts into stunning photorealistic renders that captivate your clients and close deals faster.',
    hero_btn1_text TEXT DEFAULT 'View Portfolio',
    hero_btn1_link TEXT DEFAULT 'portfolio.html',
    hero_btn2_text TEXT DEFAULT 'Get Free Quote',
    hero_btn2_link TEXT DEFAULT 'contact.html',
    
    -- Cloudinary Hero Images
    cloudinary_hero1 TEXT,
    cloudinary_hero2 TEXT,
    cloudinary_hero3 TEXT,
    cloudinary_hero4 TEXT,
    cloudinary_hero5 TEXT,

    -- YouTube Videos (Columns)
    youtube_video1 TEXT,
    youtube_video2 TEXT,
    youtube_video3 TEXT,
    youtube_video4 TEXT,
    
    -- HOME PAGE - Services Section
    services_heading TEXT DEFAULT 'Our Expertise',
    services_subheading TEXT DEFAULT 'Tailored visualization solutions for architects, developers, and real estate professionals.',
    
    -- HOME PAGE - Portfolio Preview
    portfolio_heading TEXT DEFAULT 'Featured Projects',
    portfolio_subheading TEXT DEFAULT 'A selection of our latest architectural visualizations.',
    
    -- HOME PAGE - Why Section
    why_heading TEXT DEFAULT 'Why RenderLine?',
    why_point1 TEXT DEFAULT 'Architect-first collaborative workflow',
    why_point2 TEXT DEFAULT 'Realistic lighting & material accuracy',
    why_point3 TEXT DEFAULT 'Industry-leading software & techniques',
    why_point4 TEXT DEFAULT 'Fast revisions & project confidentiality',
    why_point5 TEXT DEFAULT 'Affordable pricing, premium results',
    why_btn_text TEXT DEFAULT 'Start Your Project',
    
    -- HOME PAGE - CTA Section
    cta_heading TEXT DEFAULT 'Ready to Visualize Your Vision?',
    cta_text TEXT DEFAULT 'Let''s discuss your project. Get a free consultation and custom quote today.',
    cta_btn1_text TEXT DEFAULT 'Contact Us',
    cta_btn2_text TEXT DEFAULT 'WhatsApp: 0311-4544040',
    
    -- ABOUT PAGE - Profile
    about_name TEXT DEFAULT 'Dilawar Ali',
    about_title TEXT DEFAULT 'Founder & Creative Director',
    about_image TEXT DEFAULT 'assets/images/dilawar-ali.jpg',
    about_bio1 TEXT DEFAULT 'Welcome to RenderLine – where architectural dreams transform into breathtaking visual realities. I founded this studio with a singular vision: to bridge the gap between an architect''s imagination and their client''s understanding through the power of photorealistic visualization.',
    about_bio2 TEXT DEFAULT 'With expertise spanning 3D modeling, V-Ray & Corona rendering, Lumion animations, and Unreal Engine real-time visualization, I deliver renders that don''t just show spaces – they evoke emotions. Every shadow, reflection, and texture is crafted to tell your project''s story.',
    about_bio3 TEXT DEFAULT 'My deep understanding of the Saudi Arabian market – from the majestic Najdi architecture of Riyadh to the coastal elegance of Jeddah – enables me to create culturally resonant visualizations that speak directly to your target audience.',
    
    -- ABOUT PAGE - Stats
    stat_projects TEXT DEFAULT '200+',
    stat_projects_label TEXT DEFAULT 'Projects Completed',
    stat_clients TEXT DEFAULT '50+',
    stat_clients_label TEXT DEFAULT 'Happy Clients',
    stat_experience TEXT DEFAULT '5+',
    stat_experience_label TEXT DEFAULT 'Years Experience',
    
    -- SERVICES DATA (Stored in columns for Admin Panel simplicity)
    service1_title TEXT, service1_desc TEXT, service1_icon TEXT, service1_timeline TEXT, service1_price TEXT, service1_features TEXT, cloudinary_service1 TEXT,
    service2_title TEXT, service2_desc TEXT, service2_icon TEXT, service2_timeline TEXT, service2_price TEXT, service2_features TEXT, cloudinary_service2 TEXT,
    service3_title TEXT, service3_desc TEXT, service3_icon TEXT, service3_timeline TEXT, service3_price TEXT, service3_features TEXT, cloudinary_service3 TEXT,
    service4_title TEXT, service4_desc TEXT, service4_icon TEXT, service4_timeline TEXT, service4_price TEXT, service4_features TEXT, cloudinary_service4 TEXT,
    service5_title TEXT, service5_desc TEXT, service5_icon TEXT, service5_timeline TEXT, service5_price TEXT, service5_features TEXT, cloudinary_service5 TEXT,
    service6_title TEXT, service6_desc TEXT, service6_icon TEXT, service6_timeline TEXT, service6_price TEXT, service6_features TEXT, cloudinary_service6 TEXT,

    -- CONTACT PAGE
    contact_heading TEXT DEFAULT 'Get In Touch',
    contact_subheading TEXT DEFAULT 'Ready to bring your architectural vision to life? Let''s discuss your project.',
    contact_email TEXT DEFAULT 'inforenderline@gmail.com',
    contact_whatsapp TEXT DEFAULT '923114544040',
    contact_phone_display TEXT DEFAULT '0311-4544040',
    contact_location TEXT DEFAULT 'Lahore, Pakistan',
    
    -- FOOTER
    footer_brand TEXT DEFAULT 'RenderLine.',
    footer_tagline TEXT DEFAULT 'Premium Architectural Visualization',
    footer_copyright TEXT DEFAULT '© 2024 RenderLine. All Rights Reserved.',
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row if not exists
INSERT INTO site_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 2. MESSAGES TABLE (New Contact Form)
-- =============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  phone text,
  subject text,
  project_type text,
  message text not null,
  status text default 'new',
  read boolean default false
);

-- RLS for Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert to messages" ON public.messages;
CREATE POLICY "Allow public insert to messages" ON public.messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin select messages" ON public.messages;
CREATE POLICY "Allow admin select messages" ON public.messages FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin update messages" ON public.messages;
CREATE POLICY "Allow admin update messages" ON public.messages FOR UPDATE USING (auth.role() = 'authenticated');

-- =============================================
-- 3. PORTFOLIO ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS portfolio_items (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'exterior',
    description TEXT,
    client_name TEXT,
    project_location TEXT,
    featured BOOLEAN DEFAULT false,
    is_video BOOLEAN DEFAULT false,
    video_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read portfolio" ON portfolio_items;
CREATE POLICY "Public read portfolio" ON portfolio_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin all portfolio" ON portfolio_items;
CREATE POLICY "Admin all portfolio" ON portfolio_items FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- 4. VIDEOS TABLE (Dynamic Gallery)
-- =============================================
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    video_url TEXT NOT NULL,
    category TEXT DEFAULT 'walkthrough',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read videos" ON videos;
CREATE POLICY "Public read videos" ON videos FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admin all videos" ON videos;
CREATE POLICY "Admin all videos" ON videos FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- 5. STORAGE BUCKETS (If needed)
-- =============================================
-- Buckets are usually global, but inserting confirms existence
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public view storage" ON storage.objects;
CREATE POLICY "Public view storage" ON storage.objects FOR SELECT USING (bucket_id IN ('portfolio-images', 'service-images', 'videos'));

DROP POLICY IF EXISTS "Auth upload storage" ON storage.objects;
CREATE POLICY "Auth upload storage" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth delete storage" ON storage.objects;
CREATE POLICY "Auth delete storage" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- 6. LEGACY CONTACTS TABLE (Optional Backup)
-- =============================================
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name TEXT, email TEXT, phone TEXT, message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. SCHEMA MIGRATIONS (Ensure columns exist if table already exists)
-- This is critical because CREATE TABLE IF NOT EXISTS won't add new columns to an existing table.
-- =============================================

-- Cloudinary & YouTube
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero1 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero2 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero3 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero4 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_hero5 TEXT;

ALTER TABLE site_content ADD COLUMN IF NOT EXISTS youtube_video1 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS youtube_video2 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS youtube_video3 TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS youtube_video4 TEXT;

-- Service Page Headings
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS services_heading TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS services_subheading TEXT;

-- Service 1
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service1_title TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service1_desc TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service1_icon TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service1_timeline TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service1_price TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service1_features TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_service1 TEXT;

-- Service 2
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service2_title TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service2_desc TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service2_icon TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service2_timeline TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service2_price TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service2_features TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_service2 TEXT;

-- Service 3
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service3_title TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service3_desc TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service3_icon TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service3_timeline TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service3_price TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service3_features TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_service3 TEXT;

-- Service 4
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service4_title TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service4_desc TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service4_icon TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service4_timeline TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service4_price TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service4_features TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_service4 TEXT;

-- Service 5
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service5_title TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service5_desc TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service5_icon TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service5_timeline TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service5_price TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service5_features TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_service5 TEXT;

-- Service 6
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service6_title TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service6_desc TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service6_icon TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service6_timeline TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service6_price TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS service6_features TEXT;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS cloudinary_service6 TEXT;

-- About Image
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS about_image TEXT;

-- =============================================
-- DONE! Complete schema ready.
-- =============================================
