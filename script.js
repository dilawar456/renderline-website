document.addEventListener('DOMContentLoaded', () => {

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
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
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
                if (currentIndexEl) currentIndexEl.textContent = currentIndex + 1;
            }
        }

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
        const videoPlayer = document.getElementById('videoPlayer');
        const videoLightboxClose = document.getElementById('videoLightboxClose');

        // Expose openVideoLightbox
        window.openVideoLightbox = function (videoSrc) {
            videoPlayer.src = videoSrc;
            videoLightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            videoPlayer.play();
        }

        // Attach listeners to existing static cards (if any)
        document.querySelectorAll('.video-card').forEach(card => {
            card.addEventListener('click', () => {
                window.openVideoLightbox(card.dataset.video);
            });
        });

        if (videoLightboxClose) videoLightboxClose.addEventListener('click', () => {
            videoLightbox.classList.remove('active');
            document.body.style.overflow = '';
            videoPlayer.pause();
            videoPlayer.src = '';
        });

        videoLightbox.addEventListener('click', (e) => {
            if (e.target === videoLightbox) {
                videoLightbox.classList.remove('active');
                document.body.style.overflow = '';
                videoPlayer.pause();
                videoPlayer.src = '';
            }
        });
    }
});
