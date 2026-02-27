import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getSiteContent, getPortfolioItems, getPortfolioOrder, optimizeCloudinaryUrl } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'RenderLine | Premium Architectural Visualization',
  description:
    'RenderLine is a premium architectural visualization studio in Lahore, Pakistan, specializing in photorealistic 3D rendering, interior design, and walkthrough animations.',
};

// Revalidate page every 60 seconds for near-real-time CMS updates
export const revalidate = 60;

export default async function HomePage() {
  // Server-side data fetching — ZERO waiting on client!
  const [contentRes, portfolioRes] = await Promise.all([
    getSiteContent(),
    getPortfolioItems(),
  ]);

  const content = contentRes.data || {};
  const allItems = portfolioRes.data || [];
  const order = await getPortfolioOrder(content);

  // Sort portfolio by saved admin order
  const sortedItems = [...allItems].sort((a, b) => {
    const idxA = order.findIndex(id => String(id) === String(a.id));
    const idxB = order.findIndex(id => String(id) === String(b.id));
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  const previewItems = sortedItems.slice(0, 5);

  const heroImages = [1, 2, 3, 4, 5].map(i => content[`cloudinary_hero${i}`] || null);
  const firstHero = heroImages[0] || '/assets/images/render40.jpg';

  return (
    <>
      {/* ============ HERO ============ */}
      <header className="hero" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
        <div className="hero-carousel">
          {heroImages.map((src, i) =>
            src ? (
              <div key={i} className={`hero-slide ${i === 0 ? 'active' : ''}`}>
                <Image
                  src={optimizeCloudinaryUrl(src, 1920)}
                  alt={`Architectural Render ${i + 1}`}
                  fill
                  className="hero-slide-img"
                  priority={i === 0}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : i === 0 ? (
              <div key={i} className="hero-slide active">
                <Image
                  src="/assets/images/render40.jpg"
                  alt="Architectural Render"
                  fill
                  priority
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : null
          )}
        </div>

        <div className="hero-overlay" />

        <div className="container">
          <div className="hero-content">
            <h1>
              <span className="hero-line-1">{content.hero_line1 || 'High-Quality Architectural'}</span>
              <span className="hero-line-2">{content.hero_line2 || 'Visualization that'}</span>
              <span className="hero-line-3">{content.hero_line3 || 'Helps Architects Win Clients'}</span>
            </h1>
            <p>{content.hero_description || 'We transform your architectural concepts into stunning photorealistic renders that captivate your clients and close deals faster.'}</p>
            <div className="hero-buttons">
              <Link href="/portfolio" className="btn btn-primary">
                {content.hero_btn1_text || 'View Portfolio'}
              </Link>
            </div>
          </div>
        </div>

        <HeroCarouselClient />
      </header>

      {/* ============ SERVICES ============ */}
      <section className="services-section section-padding">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2>{content.services_heading || 'Our Expertise'}</h2>
            <p style={{ maxWidth: '600px', margin: '1rem auto 0' }}>
              {content.services_subheading || 'Tailored visualization solutions for architects, developers, and real estate professionals.'}
            </p>
          </div>
          <div className="services-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="service-card">
                {content[`cloudinary_service${i}`] && (
                  <Image
                    src={optimizeCloudinaryUrl(content[`cloudinary_service${i}`], 600)}
                    alt={content[`service${i}_title`] || `Service ${i}`}
                    width={600}
                    height={400}
                    style={{ objectFit: 'cover', width: '100%' }}
                    loading="lazy"
                  />
                )}
                <div className="info">
                  <h3>{content[`service${i}_title`] || ['Exterior Visualization', 'Interior Visualization', '3D Animations'][i - 1]}</h3>
                  <p>{content[`service${i}_desc`] || ''}</p>
                  <Link href="/services" className="link">Learn More →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PORTFOLIO PREVIEW ============ */}
      <section className="section-padding" style={{ background: 'var(--bg-card)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <h2>Featured Projects</h2>
            <p style={{ maxWidth: '500px', margin: '1rem auto 0' }}>
              A selection of our latest architectural visualizations.
            </p>
          </div>
          <div className="portfolio-preview">
            {previewItems.length > 0
              ? previewItems.map(item => (
                <div key={item.id} className="preview-item">
                  <Image
                    src={optimizeCloudinaryUrl(item.image_url, 600)}
                    alt={item.title || 'Project'}
                    width={600}
                    height={400}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    loading="lazy"
                  />
                </div>
              ))
              : [13, 15, 3, 16, 4].map(n => (
                <div key={n} className="preview-item">
                  <Image
                    src={`/assets/images/render${n}.jpg`}
                    alt="Project"
                    width={600}
                    height={400}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    loading="lazy"
                  />
                </div>
              ))}
          </div>
          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link href="/portfolio" className="btn btn-primary">View Full Portfolio</Link>
          </div>
        </div>
      </section>

      {/* ============ WHY ============ */}
      <section className="why-section section-padding">
        <div className="container">
          <div className="why-grid">
            <div>
              <h2>{content.why_heading || 'Why RenderLine?'}</h2>
              <ul className="benefits-list">
                {[1, 2, 3, 4, 5].map(i => (
                  <li key={i}>
                    <span>✔</span>{' '}
                    {content[`why_point${i}`] || ['Architect-first collaborative workflow', 'Realistic lighting & material accuracy', 'Industry-leading software & techniques', 'Fast revisions & project confidentiality', 'Affordable pricing, premium results'][i - 1]}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                Start Your Project
              </Link>
            </div>
            <div className="why-logo-container">
              <Image
                src="/assets/logo.png"
                alt="RenderLine"
                width={300}
                height={300}
                className="why-logo-glow"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="cta-section">
        <div className="container">
          <h2>{content.cta_heading || 'Ready to Visualize Your Vision?'}</h2>
          <p>{content.cta_text || "Let's discuss your project. Get a free consultation and custom quote today."}</p>
          <div className="cta-buttons">
            <Link href="/contact" className="btn btn-primary">Contact Us</Link>
            <a href="https://wa.me/923114544040" className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
              WhatsApp: 0311-4544040
            </a>
          </div>
        </div>
      </section>

      <HeroCarouselScript />
    </>
  );
}

// Client component for carousel interactivity
function HeroCarouselClient() {
  return null; // Handled by HeroCarouselScript
}

function HeroCarouselScript() {
  return (
    <script dangerouslySetInnerHTML={{
      __html: `
        (function() {
          var slides = document.querySelectorAll('.hero-slide');
          if (!slides.length) return;
          var current = 0;
          function show(i) {
            slides.forEach(function(s, idx) { s.classList.toggle('active', idx === i); });
            current = i;
          }
          setInterval(function() { show((current + 1) % slides.length); }, 5000);
        })();
      `
    }} />
  );
}
