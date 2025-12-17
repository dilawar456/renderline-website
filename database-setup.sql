-- =============================================
-- SUPABASE DATABASE SETUP
-- VOG WAVE Design Studio
-- =============================================
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- =============================================
-- 1. SITE CONTENT TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    hero_heading TEXT DEFAULT 'Architectural Vision Redefined.',
    hero_subheading TEXT DEFAULT 'VOG WAVE Design Studio creates emotive, high-end visualization for the Middle East''s most ambitious architectural projects.',
    hero_image TEXT DEFAULT 'assets/images/render40.jpg',
    about_name TEXT DEFAULT 'Ali Hamza',
    about_title TEXT DEFAULT 'Founder & Creative Director',
    about_bio TEXT DEFAULT 'Welcome to VOG WAVE Design Studio – where architectural dreams transform into breathtaking visual realities.',
    about_image TEXT DEFAULT 'assets/images/ali-hamza.jpg',
    stat_projects TEXT DEFAULT '200+',
    stat_clients TEXT DEFAULT '50+',
    stat_experience TEXT DEFAULT '5+',
    contact_email TEXT DEFAULT 'designstudio813@gmail.com',
    contact_whatsapp TEXT DEFAULT '923140735267',
    contact_location TEXT DEFAULT 'Riyadh / Jeddah, Saudi Arabia',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default content
INSERT INTO site_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 2. SERVICES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    timeline TEXT,
    price_from DECIMAL(10,2),
    features TEXT[], -- Array of feature tags
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default services
INSERT INTO services (title, description, image_url, timeline, features, "order") VALUES
('Exterior Visualization', 'Transform your building designs into stunning, photorealistic exterior renders. Perfect for residential towers, commercial complexes, and landscape integration.', 'assets/images/render2.jpg', '3-5 business days', ARRAY['Day/Night Scenes', 'Aerial Views', 'Landscape Design', '4K Resolution'], 1),
('Interior Visualization', 'Showcase interiors with realistic lighting, materials, and furniture placement. Ideal for luxury residences, hotels, offices, and retail spaces.', 'assets/images/render10.jpg', '2-4 business days', ARRAY['Photorealistic Materials', 'Furniture Staging', 'Multiple Angles', 'Custom Styling'], 2),
('3D Animations / Walkthroughs', 'Bring your project to life with cinematic animations. Perfect for pre-sales, marketing presentations, and client pitches.', 'assets/images/render12.jpg', '7-14 business days', ARRAY['Cinematic Quality', 'Voiceover Ready', 'Music Integration', '4K/HD Delivery'], 3),
('Floor Plan Visualization', 'Turn 2D CAD drawings into clear, understandable 3D floor plans. Essential for helping clients visualize space and layout.', 'assets/images/render21.jpg', '1-2 business days', ARRAY['3D Floor Plans', 'Furniture Layout', 'Color Coded', 'Print Ready'], 4)
ON CONFLICT DO NOTHING;

-- =============================================
-- 3. PORTFOLIO ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS portfolio_items (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'exterior', -- exterior, interior, commercial
    client_name TEXT,
    project_location TEXT,
    project_date DATE,
    description TEXT,
    featured BOOLEAN DEFAULT false,
    is_video BOOLEAN DEFAULT false,
    video_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_items(featured);

-- =============================================
-- 4. CONTACTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    project_type TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- new, read, replied, archived
    notes TEXT, -- Admin notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE
);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

-- =============================================
-- 5. CLIENTS TABLE (For Client Portal)
-- =============================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id), -- Links to Supabase Auth
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    company TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. PROJECTS TABLE (For Client Portal)
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending', -- pending, in_progress, review, completed
    project_type TEXT,
    deadline DATE,
    price DECIMAL(10,2),
    paid_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. PROJECT UPDATES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS project_updates (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachment_url TEXT,
    update_type TEXT DEFAULT 'update', -- update, milestone, revision_request
    created_by TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. TESTIMONIALS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_title TEXT,
    client_company TEXT,
    client_avatar TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    project_type TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 9. ANALYTICS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS page_views (
    id SERIAL PRIMARY KEY,
    page TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    ip_hash TEXT, -- Hashed IP for privacy
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- STORAGE BUCKETS SETUP
-- =============================================
-- Run these in the Supabase Dashboard > Storage

-- 1. Create bucket: portfolio-images (public)
-- 2. Create bucket: service-images (public)
-- 3. Create bucket: videos (public)
-- 4. Create bucket: profile (public)
-- 5. Create bucket: project-files (private - for client portal)

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access for site content
CREATE POLICY "Public can read site content" ON site_content
    FOR SELECT USING (true);

-- Public read access for services
CREATE POLICY "Public can read services" ON services
    FOR SELECT USING (is_active = true);

-- Public read access for portfolio
CREATE POLICY "Public can read portfolio" ON portfolio_items
    FOR SELECT USING (true);

-- Public can insert contacts (for contact form)
CREATE POLICY "Public can submit contact form" ON contacts
    FOR INSERT WITH CHECK (true);

-- Public read access for testimonials
CREATE POLICY "Public can read testimonials" ON testimonials
    FOR SELECT USING (is_active = true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admin full access to site_content" ON site_content
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to services" ON services
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to portfolio" ON portfolio_items
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to contacts" ON contacts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to testimonials" ON testimonials
    FOR ALL USING (auth.role() = 'authenticated');

-- Clients can only see their own projects
CREATE POLICY "Clients can view own projects" ON projects
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    );

-- =============================================
-- TRIGGER FOR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- DONE! Your database is ready.
-- =============================================
