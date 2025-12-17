-- =============================================
-- COMPLETE DATABASE SCHEMA FOR RENDERLINE
-- Run this in Supabase SQL Editor
-- =============================================

-- Drop existing tables if needed (be careful in production!)
-- DROP TABLE IF EXISTS site_content CASCADE;
-- DROP TABLE IF EXISTS services CASCADE;
-- DROP TABLE IF EXISTS portfolio_items CASCADE;
-- DROP TABLE IF EXISTS contacts CASCADE;

-- =============================================
-- 1. SITE CONTENT TABLE - ALL WEBSITE TEXT
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
    
    -- ABOUT PAGE - Expertise (8 items)
    expertise1 TEXT DEFAULT 'Residential Exteriors',
    expertise2 TEXT DEFAULT 'Commercial Buildings',
    expertise3 TEXT DEFAULT 'Luxury Interiors',
    expertise4 TEXT DEFAULT 'Landscape Design',
    expertise5 TEXT DEFAULT 'Aerial Views',
    expertise6 TEXT DEFAULT 'Night Renders',
    expertise7 TEXT DEFAULT '3D Floor Plans',
    expertise8 TEXT DEFAULT 'Virtual Tours',
    
    -- ABOUT PAGE - Tools (12 items)
    tool1 TEXT DEFAULT '3ds Max',
    tool2 TEXT DEFAULT 'SketchUp',
    tool3 TEXT DEFAULT 'V-Ray',
    tool4 TEXT DEFAULT 'Corona',
    tool5 TEXT DEFAULT 'Lumion',
    tool6 TEXT DEFAULT 'D5 Render',
    tool7 TEXT DEFAULT 'Unreal Engine',
    tool8 TEXT DEFAULT 'Photoshop',
    tool9 TEXT DEFAULT 'After Effects',
    tool10 TEXT DEFAULT 'AutoCAD',
    tool11 TEXT DEFAULT 'Revit',
    tool12 TEXT DEFAULT 'AI Tools',
    
    -- ABOUT PAGE - How I Work (5 steps)
    step1_title TEXT DEFAULT 'Consultation',
    step1_desc TEXT DEFAULT 'We discuss your project, deadlines, and specific requirements. I analyze your drawings to provide an accurate quote.',
    step2_title TEXT DEFAULT '3D Modeling',
    step2_desc TEXT DEFAULT 'I create an accurate 3D model based on your drawings. You receive a clay render for approval.',
    step3_title TEXT DEFAULT 'Materials & Lighting',
    step3_desc TEXT DEFAULT 'Textures, materials, and lighting are applied. We agree on the atmosphere and mood.',
    step4_title TEXT DEFAULT 'Rendering',
    step4_desc TEXT DEFAULT 'High-resolution photorealistic renders are produced using V-Ray or Corona.',
    step5_title TEXT DEFAULT 'Revisions',
    step5_desc TEXT DEFAULT 'Final adjustments based on your feedback. Delivery in multiple formats.',
    
    -- PORTFOLIO PAGE
    portfolio_page_heading TEXT DEFAULT 'Our Portfolio',
    portfolio_page_subheading TEXT DEFAULT 'A complete collection of 70+ high-end architectural visualizations and walkthrough animations.',
    
    -- SERVICES PAGE
    services_page_heading TEXT DEFAULT 'Our Services',
    services_page_subheading TEXT DEFAULT 'Premium architectural visualization solutions tailored to bring your vision to life with stunning photorealistic quality.',
    
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
-- 2. SERVICES TABLE - 6 SERVICES
-- =============================================
DROP TABLE IF EXISTS services CASCADE;
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    short_desc TEXT,
    full_desc TEXT,
    icon TEXT DEFAULT '🏠',
    image_url TEXT,
    timeline TEXT,
    price_from TEXT,
    feature1 TEXT,
    feature2 TEXT,
    feature3 TEXT,
    feature4 TEXT,
    feature5 TEXT,
    feature6 TEXT,
    deliverable1 TEXT,
    deliverable2 TEXT,
    deliverable3 TEXT,
    deliverable4 TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 6 default services
INSERT INTO services (title, short_desc, full_desc, icon, image_url, timeline, price_from, feature1, feature2, feature3, feature4, feature5, feature6, deliverable1, deliverable2, deliverable3, deliverable4, sort_order) VALUES
(
    'Exterior Visualization',
    'Transform your building designs into stunning, photorealistic exterior renders.',
    'Our exterior visualization service transforms your architectural designs into stunning, photorealistic images that showcase every detail of your building''s exterior. From residential villas to commercial towers, we capture the essence of your design with perfect lighting, materials, and environmental context.',
    '🏢',
    'assets/images/render2.jpg',
    '3-5 business days',
    '$150',
    'Day & Night Scenes',
    'Multiple Camera Angles',
    'Aerial/Drone Views',
    'Landscape Integration',
    '4K Ultra HD Resolution',
    'Photorealistic Materials',
    'High-res JPG/PNG files',
    'PSD with layers',
    'Print-ready formats',
    '3D model files (optional)',
    1
),
(
    'Interior Visualization',
    'Showcase interiors with realistic lighting, materials, and furniture placement.',
    'Create stunning interior visualizations that bring your design concepts to life. We specialize in luxury residential interiors, high-end commercial spaces, and hospitality projects. Our renders capture the perfect ambiance, lighting, and material textures.',
    '🛋️',
    'assets/images/render10.jpg',
    '2-4 business days',
    '$120',
    'Photorealistic Materials',
    'Custom Furniture Staging',
    'Natural & Artificial Lighting',
    'Multiple Room Angles',
    'Lifestyle Visualization',
    'Material Variations',
    'High-res JPG/PNG files',
    'Before/After comparisons',
    'Mood board matching',
    'VR-ready renders (optional)',
    2
),
(
    '3D Animations & Walkthroughs',
    'Cinematic walkthrough animations for real estate marketing.',
    'Our cinematic 3D animations bring your projects to life with smooth camera movements, realistic lighting transitions, and immersive spatial experiences. Perfect for pre-sales, investor presentations, and marketing campaigns.',
    '🎬',
    'assets/images/render12.jpg',
    '7-14 business days',
    '$500',
    'Cinematic Camera Work',
    'Professional Color Grading',
    'Background Music',
    'Voiceover Integration',
    '4K/HD Video Output',
    'Day-to-Night Transitions',
    'MP4/MOV video files',
    'Social media cuts',
    'Presentation versions',
    'Raw footage (optional)',
    3
),
(
    'Floor Plan Visualization',
    '2D CAD to 3D floor plan conversion with furniture layout.',
    'Transform your 2D floor plans into clear, visually appealing 3D representations. Perfect for real estate listings, client presentations, and marketing materials. Includes furniture layout and space planning visualization.',
    '📐',
    'assets/images/render21.jpg',
    '1-2 business days',
    '$50',
    '3D Isometric Views',
    'Furniture Layout',
    'Color-Coded Zones',
    'Dimension Labels',
    'Multiple Style Options',
    'Print-Ready Quality',
    'High-res images',
    'PDF floor plans',
    'Interactive versions',
    'CAD file updates',
    4
),
(
    'AutoCAD Drawings',
    'Professional 2D drafting and technical drawings.',
    'Complete AutoCAD drafting services including architectural drawings, construction documents, and technical plans. We deliver accurate, industry-standard drawings ready for permits and construction.',
    '📏',
    'assets/images/render3.jpg',
    '2-5 business days',
    '$80',
    'Architectural Plans',
    'Elevation Drawings',
    'Section Details',
    'Construction Documents',
    'As-Built Drawings',
    'Permit-Ready Docs',
    'DWG/DXF files',
    'PDF drawings',
    'Revision sets',
    'Print-ready formats',
    5
),
(
    'Design & Construction Consultation',
    'Expert guidance from concept to completion.',
    'Get professional advice on your architectural and construction projects. From initial concept development to material selection and construction oversight, we provide comprehensive consultation services.',
    '💡',
    'assets/images/render4.jpg',
    'Flexible',
    '$100/hour',
    'Concept Development',
    'Material Selection',
    'Cost Estimation',
    'Contractor Coordination',
    'Site Visits',
    'Design Reviews',
    'Consultation reports',
    'Material specifications',
    'Budget estimates',
    'Project timelines',
    6
);

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

-- =============================================
-- 4. VIDEOS TABLE
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

-- Insert default videos
INSERT INTO videos (title, description, thumbnail_url, video_url, sort_order) VALUES
('House Animation 1', 'Exterior walkthrough animation', 'assets/images/render12.jpg', 'assets/videos/1.mp4', 1),
('House Animation 2', 'Interior walkthrough animation', 'assets/images/render21.jpg', 'assets/videos/2.mp4', 2);

-- =============================================
-- 5. CONTACTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    project_type TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. STORAGE BUCKETS
-- =============================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 7. ROW LEVEL SECURITY
-- =============================================
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read portfolio" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Public read videos" ON videos FOR SELECT USING (is_active = true);
CREATE POLICY "Public insert contacts" ON contacts FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin all site_content" ON site_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all portfolio" ON portfolio_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all videos" ON videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated');

-- Storage policies
CREATE POLICY "Public view storage" ON storage.objects FOR SELECT USING (bucket_id IN ('portfolio-images', 'service-images', 'profile-images', 'videos'));
CREATE POLICY "Auth upload storage" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id IN ('portfolio-images', 'service-images', 'profile-images', 'videos'));
CREATE POLICY "Auth delete storage" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- DONE! Complete schema ready.
-- =============================================
