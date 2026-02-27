import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getSiteContent, optimizeCloudinaryUrl } from '@/lib/supabase';

export const metadata: Metadata = {
    title: 'Services',
    description: 'RenderLine offers professional architectural visualization services including exterior & interior 3D rendering, walkthroughs, floor plans, and AutoCAD drawings.',
};

export const revalidate = 60;

const serviceDefaults = [
    { title: 'Exterior Visualization', icon: '🏛️', desc: 'Photorealistic exterior renders of villas, towers, and commercial buildings.', price: 'From $150' },
    { title: 'Interior Visualization', icon: '🛋️', desc: 'Luxury residential and commercial interior renders.', price: 'From $120' },
    { title: '3D Animation', icon: '🎬', desc: 'Cinematic walkthrough animations for real estate marketing.', price: 'From $500' },
    { title: 'Floor Plan Rendering', icon: '📐', desc: '2D & 3D floor plan visualizations with furniture and finishes.', price: 'From $80' },
    { title: 'AutoCAD Drawing', icon: '✏️', desc: 'Accurate architectural drawings and technical plans.', price: 'From $60' },
    { title: 'Design Consultation', icon: '💡', desc: 'Expert design guidance for your project from concept to completion.', price: 'From $50' },
];

export default async function ServicesPage() {
    const { data: content } = await getSiteContent();
    const c = content || {};

    return (
        <>
            {/* Hero */}
            <section style={{ paddingTop: '140px', paddingBottom: '3rem', background: 'var(--bg-card)', textAlign: 'center' }}>
                <div className="container">
                    <h1>{c.services_heading || 'Our Services'}</h1>
                    <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'var(--text-light)' }}>
                        {c.services_subheading || 'Tailored architectural visualization solutions for architects, developers, and real estate professionals.'}
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section-padding">
                <div className="container">
                    <div className="services-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {serviceDefaults.map((def, i) => {
                            const num = i + 1;
                            const title = c[`service${num}_title`] || def.title;
                            const desc = c[`service${num}_desc`] || def.desc;
                            const price = c[`service${num}_price`] || def.price;
                            const icon = c[`service${num}_icon`] || def.icon;
                            const imgUrl = c[`cloudinary_service${num}`] || null;
                            const features: string[] = c[`service${num}_features`]
                                ? c[`service${num}_features`].split(',').map((s: string) => s.trim()).filter(Boolean)
                                : [];
                            const highlights: string[] = c[`service${num}_highlights`]
                                ? c[`service${num}_highlights`].split(',').map((s: string) => s.trim()).filter(Boolean)
                                : [];

                            return (
                                <div key={i} className="service-card" style={{ display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-card)', boxShadow: 'var(--light-shadow, 0 10px 30px rgba(0,0,0,0.1))' }}>
                                    {imgUrl && (
                                        <Image
                                            src={optimizeCloudinaryUrl(imgUrl, 600)}
                                            alt={title}
                                            width={600}
                                            height={350}
                                            style={{ objectFit: 'cover', width: '100%', height: '220px' }}
                                            loading="lazy"
                                        />
                                    )}
                                    <div className="card-content" style={{ padding: '1.75rem', flex: 1 }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
                                        <h3 style={{ marginBottom: '0.75rem' }}>{title}</h3>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{desc}</p>
                                        {features.length > 0 && (
                                            <ul style={{ marginBottom: '1rem', listStyle: 'none', padding: 0 }}>
                                                {features.slice(0, 4).map((f, fi) => (
                                                    <li key={fi} style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                                                        <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>✔</span>{f}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-dark)' }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{price}</span>
                                            <Link href={`/contact?service=${['exterior', 'interior', 'animation', 'floorplan', 'autocad', 'consultation'][i]}`} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                                                Get Quote
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Start Your Project?</h2>
                    <p>Let&apos;s discuss your architectural vision and create something extraordinary together.</p>
                    <div className="cta-buttons">
                        <Link href="/contact" className="btn btn-primary">Contact Us</Link>
                        <a href="https://wa.me/923114544040" className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
                            WhatsApp: 0311-4544040
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
