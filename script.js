document.addEventListener('DOMContentLoaded', () => {

    // --- Analytics: Track Interactions ---
    // Track clicks on WhatsApp buttons and 'Let's Talk' (Contact) links
    const contactLinks = document.querySelectorAll('.whatsapp-float, .btn-whatsapp, a[href="contact.html"], a[href="contact.html"].btn');

    contactLinks.forEach(contactLink => {
        contactLink.addEventListener('click', () => {
            if (typeof fbq === 'function') fbq('track', 'Contact');
        });
    });

    // Elements
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.getElementById('mobileToggle');
    const themeToggle = document.getElementById('themeToggle');

    // --- Navbar Scroll Effect ---
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    if (navbar) {
        window.addEventListener('scroll', updateNavbar);
        updateNavbar();
    }

    // --- Mobile Menu Toggle ---
    if (mobileToggle && navLinks) {
        console.log('✅ Mobile toggle initialized');

        // Toggle menu on click (works for touch too)
        mobileToggle.addEventListener('click', (e) => {
            // Only prevent default if it's an anchor tag to prevent navigation
            if (e.target.tagName === 'A') e.preventDefault();

            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');

            // Force display update for debugging
            if (navLinks.classList.contains('active')) {
                navLinks.style.right = '0';
            } else {
                navLinks.style.right = '-100%';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    } else {
        console.warn('⚠️ Mobile toggle elements not found:', { mobileToggle, navLinks });
    }

    // --- Dark/Light Theme Toggle ---
    if (themeToggle) {
        // Check saved theme
        const savedTheme = localStorage.getItem('renderline-theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.textContent = '☾';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            themeToggle.textContent = isLight ? '☾' : '☀';
            localStorage.setItem('renderline-theme', isLight ? 'light' : 'dark');
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- PORTFOLIO FILTERING ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active to clicked
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');
                const items = document.querySelectorAll('.portfolio-item');
                const portfolioSec = document.getElementById('portfolioSection');
                const videoSec = document.getElementById('videoSection');

                if (filterValue === 'animation') {
                    // Show Videos, Hide Grid
                    if (portfolioSec) portfolioSec.style.display = 'none';
                    if (videoSec) {
                        videoSec.style.display = 'block';
                        videoSec.style.opacity = '0';
                        setTimeout(() => videoSec.style.opacity = '1', 50);
                    }
                } else {
                    // Show Grid, Hide Videos
                    if (videoSec) videoSec.style.display = 'none';
                    if (portfolioSec) {
                        portfolioSec.style.display = 'block';
                        portfolioSec.style.opacity = '0';
                        setTimeout(() => portfolioSec.style.opacity = '1', 50);
                    }

                    // Filter Grid Items
                    items.forEach(item => {
                        if (filterValue === 'all' || item.classList.contains(filterValue)) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    }

    // --- LIGHTBOX LOGIC ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');
        const currentIndexEl = document.getElementById('currentIndex');
        const totalCountEl = document.getElementById('totalCount');

        let currentImages = []; // Array of sources or objects
        let currentIndex = 0;

        // Expose to window for CMS or other scripts
        window.openLightbox = function (index, allImageSources) {
            if (allImageSources && Array.isArray(allImageSources)) {
                currentImages = allImageSources;
            } else {
                // Fallback: scarp DOM if explicit array not passed
                if (currentImages.length === 0) {
                    currentImages = Array.from(document.querySelectorAll('.portfolio-item img')).map(img => img.src);
                }
            }

            currentIndex = index;
            if (totalCountEl) totalCountEl.textContent = currentImages.length;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function updateLightbox() {
            if (currentImages[currentIndex]) {
                const src = typeof currentImages[currentIndex] === 'string' ? currentImages[currentIndex] : currentImages[currentIndex].image_url;
                lightboxImg.src = src;

                // Reset Zoom
                lightboxImg.style.transform = "scale(1)";
                lightboxImg.style.cursor = "zoom-in";
                isZoomed = false;

                if (currentIndexEl) currentIndexEl.textContent = currentIndex + 1;
            }
        }

        // ZOOM LOGIC
        let isZoomed = false;
        lightboxImg.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing
            if (!isZoomed) {
                lightboxImg.style.transform = "scale(2)";
                lightboxImg.style.cursor = "zoom-out";
                isZoomed = true;
            } else {
                lightboxImg.style.transform = "scale(1)";
                lightboxImg.style.cursor = "zoom-in";
                isZoomed = false;
            }
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        if (lightboxNext) lightboxNext.addEventListener('click', () => { currentIndex = (currentIndex + 1) % currentImages.length; updateLightbox(); });
        if (lightboxPrev) lightboxPrev.addEventListener('click', () => { currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; updateLightbox(); });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % currentImages.length; updateLightbox(); }
            if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; updateLightbox(); }
        });
    }

    // --- VIDEO LIGHTBOX LOGIC ---
    const videoLightbox = document.getElementById('videoLightbox');
    if (videoLightbox) {
        const videoContainer = document.getElementById('videoContainer');
        const videoLightboxClose = document.getElementById('videoLightboxClose');

        // Expose openVideoLightbox
        window.openVideoLightbox = function (videoSrc) {
            videoLightbox.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Check if YouTube
            if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')) {
                // Ensure embed format
                let embedUrl = videoSrc;
                if (!videoSrc.includes('/embed/')) {
                    const id = videoSrc.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
                    if (id) embedUrl = `https://www.youtube.com/embed/${id[1]}?autoplay=1`;
                }

                videoContainer.innerHTML = `<iframe width="100%" height="100%" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px;"></iframe>`;
            } else {
                // Assume MP4/Local
                videoContainer.innerHTML = `<video width="100%" height="100%" controls autoplay src="${videoSrc}" style="border-radius: 8px;"></video>`;
            }
        }

        // Attach listeners to existing static cards (if any)
        document.querySelectorAll('.video-card').forEach(card => {
            card.addEventListener('click', () => {
                if (card.dataset.video) window.openVideoLightbox(card.dataset.video);
            });
        });

        const closeVideo = () => {
            videoLightbox.classList.remove('active');
            document.body.style.overflow = '';
            videoContainer.innerHTML = ''; // Stop playback
        };

        if (videoLightboxClose) videoLightboxClose.addEventListener('click', closeVideo);

        videoLightbox.addEventListener('click', (e) => {
            if (e.target === videoLightbox) closeVideo();
        });
    }
});
