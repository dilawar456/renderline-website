'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    return <Navigation key={pathname} pathname={pathname} />;
}

function Navigation({ pathname }: { pathname: string }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const menuToggleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!mobileOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const desktop = window.matchMedia('(min-width: 80rem)');
        const handleBreakpoint = (event: MediaQueryListEvent) => {
            if (event.matches) setMobileOpen(false);
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileOpen(false);
                menuToggleRef.current?.focus();
            }
        };
        desktop.addEventListener('change', handleBreakpoint);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            desktop.removeEventListener('change', handleBreakpoint);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [mobileOpen]);

    useEffect(() => {
        // Enforce dark mode
        document.body.classList.remove('light-mode');
        
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/services', label: 'Services' },
        { href: '/portfolio', label: 'Portfolio' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <>
        <nav
            className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${
                scrolled
                    ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-[var(--gold)]/20 py-3' 
                    : 'bg-[#080a09]/75 backdrop-blur-md border-b border-white/5 py-4'
            }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" onClick={() => setMobileOpen(false)} className="relative z-50 flex items-center gap-3 group">
                    <Image src="/assets/logo.png" alt="Logo" width={40} height={40} className="w-auto h-8 md:h-10 group-hover:scale-105 transition-transform" priority />
                    <span className="text-white font-serif font-bold text-base xl:text-lg tracking-[0.08em] uppercase">
                        Render<span className="text-[var(--gold)]">Line</span> Studio
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden xl:flex items-center gap-5">
                    {navLinks.map(l => {
                        const isActive = pathname === l.href;
                        return (
                            <li key={l.href}>
                                <Link 
                                    href={l.href}
                                    className={`text-xs uppercase tracking-[0.12em] transition-colors relative group py-2 ${
                                        isActive ? 'text-[var(--gold)]' : 'text-gray-300 hover:text-[var(--gold)]'
                                    }`}
                                >
                                    {l.label}
                                    <span 
                                        className={`absolute bottom-0 left-0 h-[2px] bg-[var(--gold)] transition-all duration-300 ${
                                            isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                        }`} 
                                    />
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Actions (Desktop) */}
                <div className="hidden xl:flex items-center gap-4">
                    <a href="/portal" className="rounded border border-[var(--gold)]/50 bg-black/30 px-3 py-2 text-xs font-medium text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors whitespace-nowrap">Portal ↗</a>
                    <Link 
                        href="/contact" 
                        className="px-4 py-2.5 bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold)] to-[var(--gold-dim)] text-black font-semibold text-xs tracking-wider uppercase rounded hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(212,175,55,0.3)] transition-all"
                    >
                        Let&apos;s Talk
                    </Link>
                </div>

                {/* Mobile Hamburger Toggle */}
                <button
                    ref={menuToggleRef}
                    type="button"
                    className="xl:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10 gap-1.5"
                    onClick={() => setMobileOpen(open => !open)}
                    aria-label="Toggle menu"
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-navigation"
                >
                    <span className={`w-6 h-[2px] bg-[var(--gold)] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
                    <span className={`w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                    <span className={`w-6 h-[2px] bg-[var(--gold)] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
                </button>
            </div>
        </nav>

            {/* Mobile Navigation Menu */}
            <div
                id="mobile-navigation"
                aria-hidden={!mobileOpen}
                inert={!mobileOpen}
                className={`fixed inset-0 bg-[#050505]/98 backdrop-blur-xl z-[998] transition-transform duration-500 ease-in-out xl:hidden flex flex-col justify-start sm:justify-center items-center overflow-y-auto py-24 ${
                    mobileOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <ul className="flex flex-col items-center gap-4 sm:gap-6 w-full px-6">
                    {navLinks.map(l => (
                        <li key={l.href} className="w-full text-center">
                            <Link 
                                href={l.href} 
                                onClick={() => setMobileOpen(false)}
                                className={`text-2xl uppercase tracking-widest block py-2 ${
                                    pathname === l.href ? 'text-[var(--gold)] font-bold' : 'text-gray-300'
                                }`}
                            >
                                {l.label}
                            </Link>
                        </li>
                    ))}
                    
                    <li className="w-full text-center"><a href="/portal" onClick={() => setMobileOpen(false)} className="text-xl uppercase tracking-widest block py-2 text-[var(--gold)]">Portal ↗</a></li>
                    <li aria-hidden="true" className="w-16 h-px bg-[var(--gold)]/30 my-2" />
                    
                    <li className="w-full"><Link
                        href="/contact" 
                        onClick={() => setMobileOpen(false)}
                        className="px-8 py-3 bg-[var(--gold)] text-black font-bold uppercase tracking-wider rounded w-full text-center"
                    >
                        Get a Quote
                    </Link></li>
                </ul>
            </div>
        </>
    );
}
