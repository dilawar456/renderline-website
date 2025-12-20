/**
 * RenderLine CMS Engine
 * Fetches content from Supabase/localStorage and updates the DOM
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Load localStorage content first (YouTube videos, Cloudinary images)
    loadLocalStorageContent();

    // Load Portfolio (works from localStorage OR Supabase OR static)
    const portfolioGrid = document.getElementById('portfolioGrid');
    const portfolioPreview = document.querySelector('.portfolio-preview');
    if (portfolioGrid || portfolioPreview) {
        loadPortfolio();
    }

    // Try to load from Supabase if configured
    if (typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
        loadSiteContent();

        // Load Services (if on services page)
        if (document.querySelector('.service-card') || document.querySelector('.services-grid')) {
            loadServices();
        }
    } else {
        console.log('CMS: Supabase not configured. Using localStorage/static content.');
    }
});

// Load content saved in localStorage (from Admin Panel)
function loadLocalStorageContent() {
    // YouTube Videos
    const savedVideos = localStorage.getItem('youtube_videos');
    if (savedVideos) {
        const videos = JSON.parse(savedVideos);
        console.log('CMS: Loading YouTube videos from localStorage');

        // Update video elements on portfolio page
        for (let i = 1; i <= 4; i++) {
            const videoContainer = document.getElementById('youtubeEmbed' + i);
            if (videoContainer && videos['youtube_video' + i]) {
                const videoId = getYouTubeId(videos['youtube_video' + i]);
                if (videoId) {
                    videoContainer.innerHTML = `<iframe width="100%" height="300" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="border-radius: 12px;"></iframe>`;
                }
            }
        }
    }

    // Cloudinary Hero Images
    const savedCloudinary = localStorage.getItem('cloudinary_images');
    if (savedCloudinary) {
        const images = JSON.parse(savedCloudinary);
        console.log('CMS: Loading Cloudinary images from localStorage');

        // Update hero carousel if exists
        for (const key in images) {
            const imgId = 'heroSlide' + key.split('_')[1];
            const img = document.getElementById(imgId);
            if (img && images[key]) {
                img.src = images[key];
            }
        }
    }
}

function getYouTubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
    return match ? match[1] : null;
}

async function loadSiteContent() {
    const { data: content, error } = await getSiteContent();
    if (error || !content) return;

    // Helper to safely set text
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el && text) el.innerText = text;
    };

    // Helper to safely set Image src
    const setImg = (id, src) => {
        const el = document.getElementById(id);
        if (el && src) el.src = src;
    };

    // Helper to safely set Link
    const setLink = (id, href) => {
        const el = document.getElementById(id);
        if (el && href) el.href = href;
    };

    // --- HOME PAGE & GENERAL ---
    setText('heroHeading', content.hero_heading); // Keeps support if header used
    setText('heroSubheading', content.hero_subheading);

    // Hero Section (New Fields)
    setText('heroBadge', content.hero_badge);
    setText('heroLine1', content.hero_line1);
    setText('heroLine2', content.hero_line2);
    setText('heroLine3', content.hero_line3);
    setText('heroDesc', content.hero_description);

    const btn1 = document.getElementById('heroBtn1');
    if (btn1 && content.hero_btn1_text) btn1.innerText = content.hero_btn1_text;

    // Cloudinary Hero images
    for (let i = 1; i <= 5; i++) {
        if (content['cloudinary_hero' + i]) setImg('heroSlide' + i, content['cloudinary_hero' + i]);
    }

    // Why Choose Us
    setText('whyHeading', content.why_heading);
    for (let i = 1; i <= 5; i++) {
        setText('whyPoint' + i, content['why_point' + i]);
    }

    // CTA
    setText('ctaHeading', content.cta_heading);
    setText('ctaText', content.cta_text);

    // Cloudinary Optimization Helper
    const optimizeUrl = (url, width = 800) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        // Insert transformation params after /upload/
        return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width}/`);
    };

    // --- ABOUT PAGE ---
    setText('aboutName', content.about_name);
    setText('aboutTitle', content.about_title);

    // Fix: Match ID for About Profile Image (Home & About Page)
    if (content.about_image) {
        const optimizedSrc = optimizeUrl(content.about_image, 600);
        // About Page
        setImg('aboutProfileImg', optimizedSrc);
        // Index Page Preview
        setImg('aboutProfileImg', optimizedSrc); // ID is same on both pages
    }

    setText('step1Title', content.step1_title);
    setText('step2Title', content.step2_title);
    setText('step3Title', content.step3_title);
    setText('step4Title', content.step4_title);

    setText('statProjects', content.stat_projects);
    setText('statClients', content.stat_clients);
    setText('statExperience', content.stat_experience);

    // --- FOOTER / CONTACT ---
    setText('footerBrand', content.footer_brand);
    setText('footerTagline', content.footer_tagline);
    setText('footerCopyright', content.footer_copyright);

    // Update contact info in various places
    document.querySelectorAll('.contact-email').forEach(el => el.innerText = content.contact_email);
    document.querySelectorAll('.contact-phone').forEach(el => el.innerText = content.contact_phone_display);
    document.querySelectorAll('.contact-location').forEach(el => el.innerText = content.contact_location);

    const waParams = `?text=Hello%20${content.footer_brand || 'RenderLine'}%2C%20I%20would%20like%20to%20discuss%20a%20project.`;
    document.querySelectorAll('.whatsapp-link').forEach(el => {
        if (content.contact_whatsapp) el.href = `https://wa.me/${content.contact_whatsapp}${waParams}`;
    });

    console.log('✅ CMS: Site content loaded');
}

async function loadServices() {
    const { data: content } = await getSiteContent();
    if (!content) return;

    const keys = ['exterior', 'interior', 'animation', 'floorplan', 'autocad', 'consultation'];

    for (let i = 1; i <= 6; i++) {
        // IDs on Service Page
        const titleEl = document.getElementById(`service${i}Title`);
        const descEl = document.getElementById(`service${i}Desc`);
        const priceEl = document.getElementById(`service${i}Price`);
        const imgEl = document.getElementById(`service${i}Image`);
        const iconEl = document.getElementById(`service${i}Icon`);

        // IDs on Home Page
        const homeTitle = document.getElementById(`service${i}TitleHome`);
        const homeDesc = document.getElementById(`service${i}DescHome`);
        const homeImg = document.getElementById(`service${i}ImageHome`);

        if (titleEl && content[`service${i}_title`]) titleEl.innerText = content[`service${i}_title`];
        if (descEl && content[`service${i}_desc`]) descEl.innerText = content[`service${i}_desc`];
        if (priceEl && content[`service${i}_price`]) priceEl.innerText = content[`service${i}_price`];
        if (iconEl && content[`service${i}_icon`]) iconEl.innerText = content[`service${i}_icon`];
        if (imgEl && content[`cloudinary_service${i}`]) imgEl.src = content[`cloudinary_service${i}`];

        // Home Page Updates
        if (homeTitle && content[`service${i}_title`]) homeTitle.innerText = content[`service${i}_title`];
        if (homeDesc && content[`service${i}_desc`]) homeDesc.innerText = content[`service${i}_desc`];
        if (homeImg && content[`cloudinary_service${i}`]) homeImg.src = content[`cloudinary_service${i}`];

        // UPDATE MODAL DATA (window.serviceData)
        if (window.serviceData && keys[i - 1]) {
            const key = keys[i - 1];
            if (content[`service${i}_title`]) window.serviceData[key].title = content[`service${i}_title`];
            if (content[`service${i}_modal_desc`]) window.serviceData[key].description = content[`service${i}_modal_desc`];
            if (content[`service${i}_price`]) window.serviceData[key].price = content[`service${i}_price`];
            // Update Image in modal if changed
            if (content[`cloudinary_service${i}`]) window.serviceData[key].image = content[`cloudinary_service${i}`];

            // Arrays
            if (content[`service${i}_features`]) {
                window.serviceData[key].features = content[`service${i}_features`].split(',').map(s => s.trim());
            }
            if (content[`service${i}_highlights`]) {
                window.serviceData[key].highlights = content[`service${i}_highlights`].split(',').map(s => s.trim());
            }
        }
    }
    console.log('✅ CMS: Services loaded & Modal Data Updated');
}

async function loadAboutSections(content) {
    if (!content) return;

    // Workflow Steps (My Workflow)
    for (let i = 1; i <= 4; i++) {
        if (content[`step${i}_title`]) {
            const el = document.getElementById(`step${i}Title`);
            if (el) el.innerText = content[`step${i}_title`];
        }
        if (content[`step${i}_desc`]) {
            const el = document.getElementById(`step${i}Desc`);
            if (el) el.innerText = content[`step${i}_desc`];
        }
    }

    // Expertise (About Page)
    if (content.expertise_subtitle) {
        const sub = document.getElementById('expertiseSubtitle');
        if (sub) sub.innerText = content.expertise_subtitle;
    }

    for (let i = 1; i <= 8; i++) {
        if (content[`expertise${i}_title`]) {
            const el = document.getElementById(`expertise${i}Title`);
            if (el) el.innerText = content[`expertise${i}_title`];
        }
        if (content[`expertise${i}_desc`]) {
            const el = document.getElementById(`expertise${i}Desc`);
            if (el) el.innerText = content[`expertise${i}_desc`];
        }
    }

    // Tools List
    if (content.tools_subtitle) {
        const sub = document.getElementById('toolsSubtitle');
        if (sub) sub.innerText = content.tools_subtitle;
    }

    if (content.tools_list) {
        const toolsGrid = document.getElementById('toolsGrid');
        if (toolsGrid) {
            const tools = content.tools_list.split(',').map(s => s.trim()).filter(s => s);
            toolsGrid.innerHTML = tools.map(tool => `
                <div style="padding: 1rem 1.5rem; background: var(--bg-dark); border: 1px solid var(--border-dark); border-radius: 8px; font-size: 0.9rem; color: var(--text-light); transition: 0.3s; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--primary);">●</span> ${tool}
                </div>
            `).join('');
        }
    }
}

// PORTFOLIO LOADING WITH SORTING
async function loadPortfolio() {
    let items = [];
    let pOrder = [];

    // 1. Fetch Items
    if (typeof getPortfolioItems === 'function' && isSupabaseConfigured()) {
        const { data } = await getPortfolioItems();
        if (data) items = data;

        // 2. Fetch Order from Site Content
        const { data: content } = await getSiteContent();
        if (content && content.portfolio_order) {
            try { pOrder = JSON.parse(content.portfolio_order); } catch (e) { }
        }

        // Load extra about sections if content is fetched
        if (content) loadAboutSections(content);
    } else {
        items = JSON.parse(localStorage.getItem('portfolio_items') || '[]');
    }

    // 3. SORT Items if order exists
    if (pOrder && pOrder.length > 0) {
        items.sort((a, b) => {
            const idxA = pOrder.indexOf(a.id);
            const idxB = pOrder.indexOf(b.id);
            if (idxA === -1 && idxB === -1) return 0;
            if (idxA === -1) return 1;
            if (idxB === -1) return -1;
            return idxA - idxB;
        });
    }

    // 4. Render to Main Portfolio Grid
    const grid = document.getElementById('portfolioGrid');
    if (grid) {
        grid.innerHTML = '';
        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = `portfolio-item mix ${item.category || ''}`;
            // Clean Image Only - No Text/Overlay
            card.innerHTML = `
                <img src="${item.image_url}" alt="${item.title}" loading="lazy">
            `;
            // Click to Open Lightbox
            card.onclick = () => {
                if (window.openLightbox) {
                    window.openLightbox(index, items);
                }
            };
            grid.appendChild(card);
        });
    }

    // 5. Render to Home Page Preview (Top 5)
    const preview = document.querySelector('.portfolio-preview');
    if (preview && items.length > 0) {
        preview.innerHTML = '';
        const previewItems = items.slice(0, 5); // Take top 5
        previewItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `<img src="${item.image_url}" alt="${item.title}" loading="lazy">`;
            preview.appendChild(div);
        });
    }

    console.log(`✅ CMS: Loaded ${items.length} portfolio items (Sorted)`);
}

// VIDEO GALLERY LOADING
async function loadVideoGallery() {
    const gallery = document.getElementById('dynamicVideoGallery');
    if (!gallery) return;

    let videos = [];

    // 1. Fetch from Supabase
    if (typeof supabaseDb !== 'undefined') {
        const { data, error } = await supabaseDb.from('site_videos').select('*').order('created_at', { ascending: false });
        if (data) videos = data;
    }

    // 2. Fallback to LocalStorage
    if (videos.length === 0) {
        videos = JSON.parse(localStorage.getItem('my_portfolio_videos') || '[]');
    }

    // 3. Render
    gallery.innerHTML = '';
    const staticGrid = document.getElementById('staticVideoGrid'); // Fallback grid

    if (videos.length === 0) {
        // Show static fallback if no dynamic videos
        if (staticGrid) staticGrid.style.display = 'grid';
    } else {
        // Hide static fallback if dynamic videos exist
        if (staticGrid) staticGrid.style.display = 'none';

        videos.forEach(vid => {
            const card = document.createElement('div');
            card.className = 'video-card';
            // Extract ID
            let videoId = '';
            let thumbUrl = 'assets/images/render40.jpg'; // Default safe thumb

            if (vid.video_url && (vid.video_url.includes('youtube') || vid.video_url.includes('youtu.be'))) {
                const match = vid.video_url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^&\s?]+)/);
                if (match) {
                    videoId = match[1];
                    thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }
            }

            // Add click handler for lightbox
            card.onclick = () => {
                if (window.openVideoLightbox) {
                    // Use embed URL for lightbox if YouTube, else direct link
                    const playUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : vid.video_url;
                    window.openVideoLightbox(playUrl);
                }
            };

            // Render Card
            card.innerHTML = `
                <div class="video-thumb">
                    <img src="${thumbUrl}" alt="${vid.title}" style="object-fit:cover;">
                    <div class="play-icon"></div>
                </div>
                <div class="video-info">
                    <h4>${vid.title}</h4>
                    <p>Animation</p>
                </div>
            `;
            gallery.appendChild(card);
        });
    }
    console.log(`✅ CMS: Loaded ${videos.length} videos`);
}

// Ensure loadVideoGallery is called
document.addEventListener('DOMContentLoaded', () => {
    // ... existing calls ...
    loadVideoGallery();
});
