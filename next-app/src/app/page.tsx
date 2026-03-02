import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getSiteContent, getPortfolioItems, getPortfolioOrder, optimizeCloudinaryUrl } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'RenderLine | Premium Architectural Visualization',
  description: 'RenderLine is a premium architectural visualization studio in Lahore, Pakistan, specializing in photorealistic 3D rendering, interior design, and walkthrough animations.',
};

export const revalidate = 60;

export default async function HomePage() {
  const [contentRes, portfolioRes] = await Promise.all([getSiteContent(), getPortfolioItems()]);
  const content = contentRes.data || {};
  const allItems = portfolioRes.data || [];
  const orderRecord = await getPortfolioOrder(content);
  const order = orderRecord.all || [];

  const sortedItems = [...allItems].sort((a, b) => {
    const iA = order.findIndex(id => String(id) === String(a.id));
    const iB = order.findIndex(id => String(id) === String(b.id));
    if (iA === -1 && iB === -1) return 0;
    if (iA === -1) return 1;
    if (iB === -1) return -1;
    return iA - iB;
  });

  const previewItems = sortedItems.slice(0, 5);
  const heroImages = [1, 2, 3, 4, 5]
    .map(i => content[`cloudinary_hero${i}`] || null)
    .filter(Boolean) as string[];

  return (
    <>
      {/* ============================================================
          HERO — Fixed layout: body flex-col, content + stats
          ============================================================ */}
      <header className="hero">
        {/* Background slides */}
        <div className="hero-bg">
          {heroImages.length > 0 ? (
            heroImages.map((src, i) => (
              <div key={i} className={`hero-slide${i === 0 ? ' active' : ''}`}>
                <Image
                  src={optimizeCloudinaryUrl(src, 1920)}
                  alt={`Render ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))
          ) : (
            /* Fallback dark gradient when no images */
            <div className="hero-slide active" style={{ background: 'linear-gradient(135deg, #0d0b09 0%, #161210 100%)' }} />
          )}
        </div>

        {/* Gradient overlay */}
        <div className="hero-overlay" />

        {/* Main content area */}
        <div className="hero-body">
          <div className="container">
            <div className="hero-text">
              <div className="hero-eyebrow">
                <span>Premium Architectural Visualization</span>
              </div>

              <h1>
                {content.hero_line1 || 'High-Quality Architectural'}{' '}
                {content.hero_line2 || 'Visualization That'}{' '}
                <span style={{ color: 'var(--gold)' }}>
                  {content.hero_line3 || 'Wins Clients'}
                </span>
              </h1>

              <p>
                {content.hero_description ||
                  'We transform architectural concepts into stunning photorealistic renders that captivate clients and close deals faster.'}
              </p>

              <div className="hero-cta">
                <Link href="/portfolio" className="btn btn-primary">
                  View Portfolio
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Start a Project
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar — pinned at bottom of hero */}
        <div className="hero-stats-bar">
          <div className="hero-stats-inner">
            <div className="hero-stat">
              <strong>{content.stat_projects || '200+'}</strong>
              <span>Projects Completed</span>
            </div>
            <div className="hero-stat">
              <strong>{content.stat_clients || '80+'}</strong>
              <span>Happy Clients</span>
            </div>
            <div className="hero-stat">
              <strong>{content.stat_experience || '5+'}</strong>
              <span>Years Experience</span>
            </div>
            <div className="hero-stat">
              <strong>70+</strong>
              <span>Portfolio Works</span>
            </div>
          </div>
        </div>

        {/* Carousel auto-advance */}
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            var slides = document.querySelectorAll('.hero-slide');
            if (slides.length < 2) return;
            var cur = 0;
            setInterval(function() {
              slides[cur].classList.remove('active');
              cur = (cur + 1) % slides.length;
              slides[cur].classList.add('active');
            }, 5500);
          })();
        ` }} />
      </header>

      {/* ===================================
          SERVICES
          =================================== */}
      <section className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">What We Offer</span>
            <h2 className="section-title">
              {content.services_heading || 'Our'} <span>Expertise</span>
            </h2>
            <div className="gold-line" />
            <p className="section-desc">
              {content.services_subheading ||
                'Tailored visualization solutions for architects, developers, and real estate professionals.'}
            </p>
          </div>

          <div className="services-grid stagger-children">
            {[1, 2, 3].map((i, idx) => {
              const imgSrc = content[`cloudinary_service${i}`];
              const icons = ['🏛️', '🛋️', '🎬'];
              const defaults = {
                title: ['Exterior Visualization', 'Interior Visualization', '3D Animations'][idx],
                desc: [
                  'High-rise towers, villas, facades & landscape integration.',
                  'Luxury residential and commercial interior styling.',
                  'Cinematic walkthroughs for real estate marketing.',
                ][idx],
              };
              return (
                <div key={i} className="service-card reveal">
                  <div className="card-img-wrap">
                    {imgSrc ? (
                      <img
                        src={optimizeCloudinaryUrl(imgSrc, 600)}
                        alt={content[`service${i}_title`] || defaults.title}
                        loading="lazy"
                        style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{ height: '220px', background: 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                        {icons[idx]}
                      </div>
                    )}
                  </div>
                  <div className="info">
                    <h3>{content[`service${i}_title`] || defaults.title}</h3>
                    <p>{content[`service${i}_desc`] || defaults.desc}</p>
                    <Link href="/services" className="link">Explore Service →</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================
          PORTFOLIO PREVIEW
          =================================== */}
      <section className="section-pad" style={{ background: 'var(--bg-card)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Selected Work</span>
            <h2 className="section-title">
              Featured <span>Projects</span>
            </h2>
            <div className="gold-line" />
            <p className="section-desc">
              A curated selection of our finest architectural visualizations from the last year.
            </p>
          </div>

          <div className="portfolio-preview reveal">
            {previewItems.length > 0
              ? previewItems.map(item => (
                <Link key={item.id} href="/portfolio" className="preview-item">
                  <img
                    src={optimizeCloudinaryUrl(item.image_url, 600)}
                    alt={item.title || 'Project'}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </Link>
              ))
              : Array.from({ length: 5 }, (_, n) => (
                <div key={n} className="preview-item" style={{ background: 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.72rem', letterSpacing: '0.12em' }}>
                  PROJECT {n + 1}
                </div>
              ))}
          </div>

          <div className="text-center reveal" style={{ marginTop: '3rem' }}>
            <Link href="/portfolio" className="btn btn-primary">View Full Portfolio</Link>
          </div>
        </div>
      </section>

      {/* ===================================
          WHY RENDERLINE
          =================================== */}
      <section className="why-section section-pad">
        <div className="container">
          <div className="why-grid">
            <div className="reveal-left">
              <span className="section-label">Why Choose Us</span>
              <h2 className="section-title">
                {content.why_heading || 'Why'} <span>RenderLine?</span>
              </h2>
              <div className="gold-line" style={{ margin: '1.2rem 0' }} />
              <ul className="benefits-list">
                {[
                  'Architect-first collaborative workflow',
                  'Realistic lighting & material accuracy',
                  'Industry-leading software & techniques',
                  'Fast revisions & project confidentiality',
                  'Affordable pricing, premium results',
                ].map((pt, i) => (
                  <li key={i}>
                    <span className="check">✔</span>
                    {content[`why_point${i + 1}`] || pt}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                Start Your Project
              </Link>
            </div>

            <div className="why-visual reveal-right">
              <Image
                src="/assets/logo.png"
                alt="RenderLine"
                width={240}
                height={240}
                className="why-logo"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================
          CTA
          =================================== */}
      <section className="cta-section">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Get Started Today</span>
            <h2 className="section-title">
              {content.cta_heading || 'Ready to Visualize Your Vision?'}
            </h2>
            <div className="gold-line" />
            <p className="section-desc">
              {content.cta_text ||
                "Let's discuss your project. Get a free consultation and custom quote today."}
            </p>
            <div className="cta-buttons">
              <Link href="/contact" className="btn btn-primary">Contact Us</Link>
              <a
                href="https://wa.me/923114544040"
                className="btn btn-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp: 0311-4544040
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
