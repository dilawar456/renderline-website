import Link from 'next/link';

const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contact', label: 'Contact' },
];

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <h3>RenderLine.</h3>
                    <p>Premium Architectural Visualization</p>
                </div>
                <div className="footer-links">
                    {links.map(l => (
                        <Link key={l.href} href={l.href}>{l.label}</Link>
                    ))}
                </div>
                <div className="footer-contact">
                    <p>Lahore, Pakistan</p>
                    <p>
                        <a href="https://wa.me/923114544040">0311-4544040</a>
                    </p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 RenderLine. All Rights Reserved.</p>
            </div>

            {/* WhatsApp Float */}
            <a href="https://wa.me/923114544040" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M12.0041 2C6.48624 2 1.99609 6.49015 1.99609 12.008C1.99609 13.7917 2.4706 15.4853 3.32427 16.9737L2 22L7.2023 20.671C8.63666 21.5281 10.2825 22.016 12.0041 22.016C17.5219 22.016 22.0121 17.5259 22.0121 12.008C22.0121 6.49015 17.5219 2 12.0041 2ZM12.0041 20.216C10.5186 20.216 9.10373 19.8053 7.87324 19.0831L7.56846 18.9042L4.60677 19.6644L5.38541 16.7118L5.19532 16.398C4.39704 15.1118 3.97216 13.5932 3.97216 12.008C3.97216 7.57917 7.57527 3.97606 12.0041 3.97606C16.4329 3.97606 20.036 7.57917 20.036 12.008C20.036 16.4369 16.4329 20.216 12.0041 20.216Z" />
                </svg>
            </a>
        </footer>
    );
}
