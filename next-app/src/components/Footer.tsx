import Link from 'next/link';
import Image from 'next/image';

const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contact', label: 'Contact' },
];

const social = [
    { label: 'Instagram', href: 'https://instagram.com/renderline.arch' },
    { label: 'WhatsApp', href: 'https://wa.me/923114544040' },
];

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-inner">
                    <div>
                        <p className="footer-brand-name">RenderLine.</p>
                        <p className="footer-tagline">Premium Architectural Visualization<br />by Dilawar Ali — Lahore, Pakistan</p>
                        <a
                            href="https://wa.me/923114544040"
                            className="btn btn-whatsapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.78rem', padding: '0.6rem 1.4rem' }}
                        >
                            WhatsApp Us
                        </a>
                    </div>

                    <div className="footer-col">
                        <h4>Navigation</h4>
                        {links.map(l => (
                            <Link key={l.href} href={l.href}>{l.label}</Link>
                        ))}
                    </div>

                    <div className="footer-col">
                        <h4>Contact</h4>
                        <p>Lahore, Pakistan</p>
                        <a href="mailto:inforenderline@gmail.com">inforenderline@gmail.com</a>
                        <a href="tel:+923114544040">0311-4544040</a>
                        <br />
                        {social.map(s => (
                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                                {s.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2025 RenderLine. All Rights Reserved.</p>
                    <Link href="/contact">Start a Project →</Link>
                </div>
            </div>

            {/* WhatsApp Float */}
            <a
                href="https://wa.me/923114544040"
                className="whatsapp-float"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
            >
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.88.52 3.65 1.44 5.18L2 22l4.95-1.43A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.92 13.52c-.2.57-.99 1.04-1.64 1.18-.44.09-.99.17-5.2-2.23C7.2 12.4 6.04 10.2 5.93 10c-.1-.16-.8-1.12-.8-2.12 0-1 .53-1.48.72-1.68.18-.2.38-.25.5-.25h.37c.12 0 .28-.04.44.36.17.4.56 1.43.61 1.53.05.1.08.22.02.36-.07.13-.1.22-.2.34-.1.12-.22.27-.31.36-.1.1-.2.2-.09.4.12.2.52.88 1.12 1.43.77.72 1.42.94 1.62 1.05.2.1.31.09.43-.05.12-.14.5-.58.63-.78.13-.2.26-.17.44-.1l1.44.72c.2.1.33.14.38.23.04.09.04.53-.16 1.1z" />
                </svg>
            </a>

            {/* Scroll animation re-init after JS hydration */}
            <script dangerouslySetInnerHTML={{
                __html: `
          (function() {
            function initAnim() {
              var obs = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
              }, { threshold: 0.1 });
              document.querySelectorAll('.fade-in').forEach(function(el) { obs.observe(el); });
            }
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initAnim);
            } else { initAnim(); }
          })();
        `
            }} />
        </footer>
    );
}
