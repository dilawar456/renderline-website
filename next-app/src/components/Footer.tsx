import Link from 'next/link';
import Image from 'next/image';

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
                <div className="footer-inner">
                    {/* Brand */}
                    <div className="footer-brand">
                        <p className="footer-brand-name">RenderLine.</p>
                        <p className="footer-tagline">
                            Premium Architectural Visualization<br />
                            by Dilawar Ali — Lahore, Pakistan
                        </p>
                        <a
                            href="https://wa.me/923114544040"
                            className="btn btn-whatsapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.76rem', padding: '0.6rem 1.4rem' }}
                        >
                            WhatsApp Us
                        </a>
                    </div>

                    {/* Nav */}
                    <div className="footer-col">
                        <h4>Navigation</h4>
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href}>{l.label}</Link>
                        ))}
                    </div>

                    {/* Contact */}
                    <div className="footer-col">
                        <h4>Contact</h4>
                        <p>Lahore, Pakistan</p>
                        <a href="mailto:inforenderline@gmail.com">inforenderline@gmail.com</a>
                        <a href="tel:+923114544040">+92 311-4544040</a>
                        <a href="https://instagram.com/renderline.arch" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </div>
                </div>

                <div className="footer-bottom container">
                    <p>© 2025 RenderLine. All Rights Reserved.</p>
                    <Link href="/contact">Start a Project →</Link>
                </div>
            </div>
        </footer>
    );
}
