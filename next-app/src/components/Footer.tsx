import Link from 'next/link';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contact', label: 'Contact' },
];

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">

                {/* Top row — brand + nav + contact inline */}
                <div className="footer-top">
                    {/* Brand */}
                    <div className="footer-brand">
                        <span className="footer-logo-text">RenderLine</span>
                        <span className="footer-tagline">Premium Architectural Visualization · Lahore, Pakistan</span>
                    </div>

                    {/* Nav links */}
                    <nav className="footer-nav">
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href}>{l.label}</Link>
                        ))}
                    </nav>

                    {/* Social / contact */}
                    <div className="footer-contact">
                        <a href="https://wa.me/923114544040" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                        <a href="mailto:inforenderline@gmail.com">Email Us</a>
                        <a href="https://instagram.com/renderline.arch" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </div>
                </div>

                {/* Gold divider */}
                <div className="footer-divider" />

                {/* Bottom row — copyright + CTA */}
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} RenderLine · All Rights Reserved · Designed by Dilawar Ali</p>
                    <div className="footer-bottom-links">
                        <a href="https://wa.me/923114544040" target="_blank" rel="noopener noreferrer">+92 311-4544040</a>
                        <Link href="/contact" className="footer-cta-link">Start a Project →</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
