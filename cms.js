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
    setText('heroBtn1', content.hero_btn1_text);
    setText('heroBtn2', content.hero_btn2_text);

    // Services Section
    setText('servicesHeading', content.services_heading);
    setText('servicesSubheading', content.services_subheading);

    // Portfolio Section
    setText('portfolioHeading', content.portfolio_heading);
    setText('portfolioSubheading', content.portfolio_subheading);

    // Why Section
    setText('whyHeading', content.why_heading);
    setText('whyBtn', content.why_btn_text);

    // Why Points (Preserve checkmark)
    const setWhyPoint = (id, text) => {
        const el = document.getElementById(id);
        if (el && text) el.innerHTML = `<span>✔</span> ${text}`;
    };
    setWhyPoint('whyPoint1', content.why_point1);
    setWhyPoint('whyPoint2', content.why_point2);
    setWhyPoint('whyPoint3', content.why_point3);
    setWhyPoint('whyPoint4', content.why_point4);
    setWhyPoint('whyPoint5', content.why_point5);

    // CTA Section
    setText('ctaHeading', content.cta_heading);
    setText('ctaText', content.cta_text);
    setText('ctaBtn1', content.cta_btn1_text);
    if (content.cta_btn1_link) setLink('ctaBtn1', content.cta_btn1_link);

    setText('ctaBtn2', content.cta_btn2_text);
    if (content.cta_btn2_link) setLink('ctaBtn2', content.cta_btn2_link);

    // --- ABOUT PAGE ---
    setText('aboutName', content.about_name);
    setText('aboutTitle', content.about_title);
    if (content.about_bio) {
        const bioEl = document.getElementById('aboutBio');
        if (bioEl) bioEl.innerHTML = `<p>${content.about_bio}</p>`;
    }
    setImg('aboutProfileImg', content.about_image);

    // Stats
    setText('statProjects', content.stat_projects);
    setText('statClients', content.stat_clients);
    setText('statExperience', content.stat_experience);

    // --- YOUTUBE VIDEOS (from Supabase) ---
    for (let i = 1; i <= 4; i++) {
        const videoUrl = content['youtube_video' + i];
        const videoContainer = document.getElementById('youtubeEmbed' + i);
        if (videoContainer && videoUrl) {
            const videoId = getYouTubeId(videoUrl);
            if (videoId) {
                videoContainer.innerHTML = `<iframe width="100%" height="300" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="border-radius: 12px;"></iframe>`;
                console.log('CMS: Loaded YouTube video ' + i + ' from Supabase');
            }
        }
    }

    // --- CLOUDINARY HERO IMAGES (from Supabase) ---
    for (let i = 1; i <= 5; i++) {
        const heroUrl = content['cloudinary_hero' + i];
        if (heroUrl) {
            setImg('heroSlide' + i, heroUrl);
            console.log('CMS: Loaded Cloudinary hero ' + i + ' from Supabase');
        }
    }

    // --- CONTACT INFO (Footer & Contact Page) ---
    const contactEmail = content.contact_email;
    if (contactEmail) {
        document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
            if (el.innerText.includes('@')) el.innerText = contactEmail;
            el.href = `mailto:${contactEmail}`;
        });
    }

    // Update WhatsApp
    if (content.contact_whatsapp) {
        const waLink = `https://wa.me/${content.contact_whatsapp}`;
        document.querySelectorAll('.whatsapp-float').forEach(el => el.href = waLink);

        const ctaWaValues = document.querySelectorAll('#ctaWhatsappBtn, #footerWhatsapp');
        ctaWaValues.forEach(btn => {
            if (btn) {
                btn.href = waLink;
                btn.innerText = `WhatsApp: ${formatPhoneNumber(content.contact_whatsapp)}`;
            }
        });
    }

    // Footer Specific
    setText('footerBrand', content.footer_brand);
    setText('footerTagline', content.footer_tagline);
    setText('footerCopyright', content.footer_copyright);
    setText('footerAddress', content.contact_location);
}

function formatPhoneNumber(phone) {
    if (!phone) return '';
    // Format 923114544040 -> 0311-4544040 if matches pattern
    // Or just simple hyphenation
    return phone.replace(/^(?:92|0)?(\d{3})(\d{7})$/, '0$1-$2');
}

async function loadPortfolio() {
    let items = [];

    // Try Supabase FIRST (cloud database with Cloudinary URLs)
    if (typeof getPortfolioItems === 'function' && typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
        const { data, error } = await getPortfolioItems();
        if (data && data.length > 0) {
            console.log('CMS: Loading portfolio from Supabase (Cloudinary URLs)');
            items = data;
        }
    }

    // If Supabase has no items, check localStorage (backup)
    if (items.length === 0) {
        const localItems = JSON.parse(localStorage.getItem('portfolio_items') || '[]');
        if (localItems.length > 0) {
            console.log('CMS: Loading portfolio from localStorage');
            items = localItems;
        }
    }

    // If still no items, use fallback static images
    if (items.length === 0) {
        console.log('CMS: Loading fallback portfolio');
        const fallbackImages = [
            ...Array.from({ length: 40 }, (_, i) => `assets/images/render${i + 1}.jpg`),
            'assets/images/Scene 10.png', 'assets/images/Scene 14.png', 'assets/images/Scene 16.png'
        ];
        items = fallbackImages.map((src, i) => ({
            id: -i,
            title: `Project ${i + 1}`,
            category: ['exterior', 'interior', 'commercial'][i % 3],
            image_url: src
        }));
    }

    // Update Portfolio Page Grid
    const grid = document.getElementById('portfolioGrid');
    if (grid) {
        grid.innerHTML = '';
        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = `portfolio-item ${item.category}`;
            // Important: add data-category for filtering
            div.dataset.category = item.category;
            div.innerHTML = `
                <img src="${item.image_url}" alt="${item.title}" loading="lazy" onerror="this.parentElement.style.display='none'">
            `;
            // Lightbox click
            div.querySelector('img').addEventListener('click', () => {
                if (window.openLightbox) window.openLightbox(index, items.map(x => x.image_url));
            });
            grid.appendChild(div);
        });

        // Initialize Filter Logic if buttons exist
        initFilters();
    }

    // Update Home Page Preview
    const preview = document.querySelector('.portfolio-preview');
    if (preview) {
        preview.innerHTML = '';
        items.slice(0, 5).forEach(item => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `<img src="${item.image_url}" alt="${item.title}">`;
            preview.appendChild(div);
        });
    }
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');
    const portfolioSection = document.getElementById('portfolioSection');
    const videoSection = document.getElementById('videoSection');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            if (filter === 'animation') {
                if (portfolioSection) portfolioSection.style.display = 'none';
                if (videoSection) videoSection.style.display = 'block';
            } else {
                if (portfolioSection) portfolioSection.style.display = 'block';
                if (videoSection) videoSection.style.display = 'none';

                items.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
}

async function loadServices() {
    const { data: services, error } = await getServices();
    if (error || !services) return;

    // Logic to update services grid... 
    // This requires structured HTML generation similar to portfolio.
}
