'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('renderline-theme');
        if (saved === 'light') {
            document.body.classList.add('light-mode');
            setIsLight(true);
        }

        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        const light = document.body.classList.contains('light-mode');
        setIsLight(light);
        localStorage.setItem('renderline-theme', light ? 'light' : 'dark');
    }

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/services', label: 'Services' },
        { href: '/portfolio', label: 'Portfolio' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <nav
            className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled ? 'navbar-scrolled backdrop-blur-xl' : 'bg-transparent'
                }`}
            style={{
                background: scrolled
                    ? 'rgba(10,10,10,0.95)'
                    : 'transparent',
                boxShadow: scrolled ? '0 2px 30px rgba(0,0,0,0.3)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(212,175,55,0.12)' : 'none',
            }}
        >
            <div className="container nav-container">
                <Link href="/" className="logo">
                    <Image src="/assets/logo.png" alt="RenderLine" width={120} height={40} priority />
                </Link>

                <ul className={`nav-links ${mobileOpen ? 'active' : ''}`}>
                    {navLinks.map(l => (
                        <li key={l.href}>
                            <Link href={l.href} onClick={() => setMobileOpen(false)}>
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="nav-actions">
                    <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                        {isLight ? '☾' : '☀'}
                    </button>
                    <Link href="/contact" className="btn btn-primary">Let&apos;s Talk</Link>
                </div>

                <button
                    className={`mobile-toggle ${mobileOpen ? 'active' : ''}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>
            </div>
        </nav>
    );
}
