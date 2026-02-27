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
  const order = await getPortfolioOrder(content);

  const sortedItems = [...allItems].sort((a, b) => {
    const iA = order.findIndex(id => String(id) === String(a.id));
    const iB = order.findIndex(id => String(id) === String(b.id));
    if (iA === -1 && iB === -1) return 0;
    if (iA === -1) return 1;
    if (iB === -1) return -1;
    return iA - iB;
  });

  const previewItems = sortedItems.slice(0, 5);
  const heroImages = [1, 2, 3, 4, 5].map(i => content[`cloudinary_hero${i}`] || null).filter(Boolean);

  return (
    <>
      {/* ============ HERO ============ */}
      <header className="hero">
        <div className="hero-carousel">
          {heroImages.length > 0 ? (
            heroImages.map((src, i) => (
              <div key={i} className={`hero-slide ${i === 0 ? 'active' : ''}`}>
                <Image
                  src={optimizeCloudinaryUrl(src!, 1920)}
                  alt={`Architectural Render ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))
          ) : (
            <div className="hero-slide active">
              <Image src="/assets/logo.png" alt="RenderLine" fill style={{ objectFit: 'cover', opacity: 0.08 }} />
            </div>
          )}
        </div>
        <div className="hero-overlay" />

        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span>Premium Architectural Visualization</span>
            </div>
            <h1>
              <span className="hero-line-1">{content.hero_line1 || 'High-Quality Architectural'}</span>
              <span className="hero-line-2">{content.hero_line2 || 'Visualization that'}</span>
              <span className="hero-line-3">{content.hero_line3 || 'Helps Architects Win Clients'}</span>
            </h1>
            <p>{content.hero_description || 'We transform your architectural concepts into stunning photorealistic renders that captivate your clients and close deals faster.'}</p>
            <div className="hero-cta">
              <Link href="/portfolio" className="btn btn-primary">View Portfolio</Link>
              <Link href="/contact" className="btn btn-outline">Start a Project</Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>{content.stat_projects || '200+'}</strong>
            <span>Projects</span>
          </div>
          <div className="hero-stat">
            <strong>{content.stat_clients || '80+'}</strong>
            <span>Clients</span>
          </div>
          <div className="hero-stat">
            <strong>{content.stat_experience || '5+'}</strong>
            <span>Years</span>
          </div>
        </div>

        <HeroScript />
      </header>

      {/* ============ SERVICES ============ */}
      <section className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="text-center fade-in" style={{ marginBottom: '3.5rem' }}>
            <span className="section-label">What We Offer</span>
            <h2 className="section-title">{content.services_heading || 'Our Expertise'}</h2>
            <div className="gold-divider" />
            <p className="section-desc">{content.services_subheading || 'Tailored visualization solutions for architects, developers, and real estate professionals.'}</p>
          </div>

          <div className="services-grid stagger">
            {[1, 2, 3].map((i, idx) => (
              <div key={i} className="service-card fade-in" style={{ '--i': idx } as React.CSSProperties}>
                <div className="card-img-wrap">
                  {content[`cloudinary_service${i}`] ? (
                    <Image
                      className="card-img"
                      src={optimizeCloudinaryUrl(content[`cloudinary_service${i}`], 600)}
                      alt={content[`service${i}_title`] || `Service ${i}`}
                      width={600} height={220}
                      style={{ objectFit: 'cover', width: '100%', height: '220px' }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ height: '220px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                      {['🏛️', '🛋️', '🎬'][i - 1]}
                    </div>
                  )}
                </div>
                <div className="info">
                  <h3>{content[`service${i}_title`] || ['Exterior Visualization', 'Interior Visualization', '3D Animations'][i - 1]}</h3>
                  <p>{content[`service${i}_desc`] || ['High-rise towers, villas, facades & landscape integration.', 'Luxury residential and commercial interior styling.', 'Cinematic walkthroughs for real estate marketing.'][i - 1]}</p>
                  <Link href="/services" className="link">Explore Service →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PORTFOLIO PREVIEW ============ */}
      <section className="section-pad" style={{ background: 'var(--bg-card)' }}>
        <div className="container">
          <div className="text-center fade-in" style={{ marginBottom: '3rem' }}>
            <span className="section-label">Selected Work</span>
            <h2 className="section-title">Featured <span>Projects</span></h2>
            <div className="gold-divider" />
            <p className="section-desc">A curated selection of our finest architectural visualizations.</p>
          </div>

          <div className="portfolio-preview fade-in">
            {previewItems.length > 0
              ? previewItems.map(item => (
                <div key={item.id} className="preview-item">
                  <Image
                    src={optimizeCloudinaryUrl(item.image_url, 600)}
                    alt={item.title || 'Project'}
                    width={600} height={500}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    loading="lazy"
                  />
                </div>
              ))
              : [0, 1, 2, 3, 4].map(n => (
                <div key={n} className="preview-item" style={{ background: 'var(--bg-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                  PROJECT {n + 1}
                </div>
              ))}
          </div>

          <div className="text-center fade-in" style={{ marginTop: '3rem' }}>
            <Link href="/portfolio" className="btn btn-primary">View Full Portfolio</Link>
          </div>
        </div>
      </section>

      {/* ============ WHY ============ */}
      <section className="why-section section-pad">
        <div className="container">
          <div className="why-grid">
            <div className="fade-in">
              <span className="section-label">Why Choose Us</span>
              <h2 className="section-title">{content.why_heading || 'Why RenderLine?'}</h2>
              <div className="gold-divider" style={{ margin: '1.25rem 0' }} />
              <ul className="benefits-list">
                {[1, 2, 3, 4, 5].map(i => (
                  <li key={i}>
                    <span className="check">✔</span>
                    {content[`why_point${i}`] || ['Architect-first collaborative workflow', 'Realistic lighting & material accuracy', 'Industry-leading software & techniques', 'Fast revisions & project confidentiality', 'Affordable pricing, premium results'][i - 1]}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-primary" style={{ marginTop: '2rem' }}>Start Your Project</Link>
            </div>
            <div className="why-logo-container fade-in">
              <Image src="/assets/logo.png" alt="RenderLine" width={260} height={260} className="why-logo-glow" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="cta-section">
        <div className="container">
          <div className="fade-in">
            <span className="section-label">Get Started</span>
            <h2 className="section-title">{content.cta_heading || 'Ready to Visualize Your Vision?'}</h2>
            <div className="gold-divider" />
            <p className="section-desc">{content.cta_text || "Let's discuss your project. Get a free consultation and custom quote today."}</p>
            <div className="cta-buttons">
              <Link href="/contact" className="btn btn-primary">Contact Us</Link>
              <a href="https://wa.me/923114544040" className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
                WhatsApp: 0311-4544040
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroScript() {
  return (
    <script dangerouslySetInnerHTML={{
      __html: `(function() {
        var slides = document.querySelectorAll('.hero-slide');
        if (slides.length < 2) return;
        var cur = 0;
        function next() {
          slides[cur].classList.remove('active');
          cur = (cur + 1) % slides.length;
          slides[cur].classList.add('active');
        }
        setInterval(next, 5500);
      })();`
    }} />
  );
}
