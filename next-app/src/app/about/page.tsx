import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getSiteContent, optimizeCloudinaryUrl } from '@/lib/supabase';

export const metadata: Metadata = {
    title: 'About',
    description: 'Learn about Dilawar Ali and RenderLine — a premium architectural visualization and 3D rendering studio based in Lahore, Pakistan.',
};

export const revalidate = 60;

export default async function AboutPage() {
    const { data: content } = await getSiteContent();
    const c = content || {};

    const expertiseDefaults = [
        { t: 'Exterior Visualization', d: 'Villas, towers, facades' },
        { t: 'Interior Design', d: 'Luxury residential & commercial' },
        { t: '3D Walkthroughs', d: 'Cinematic animations' },
        { t: 'Aerial & Drone Views', d: "Bird's eye perspectives" },
        { t: 'Night & Dusk Scenes', d: 'Dramatic lighting' },
        { t: 'Commercial Spaces', d: 'Offices, retail, hotels' },
        { t: 'Floor Plans', d: '2D & 3D layouts' },
        { t: 'Real Estate Marketing', d: 'Sales-ready visuals' },
    ];

    const toolsList = (c.tools_list || '3ds Max, V-Ray, Corona Renderer, Lumion, D5 Render, Unreal Engine 5, Enscape, Twinmotion, AutoCAD, SketchUp, Revit, Blender, Photoshop, After Effects, AI Tools')
        .split(',').map((t: string) => t.trim()).filter(Boolean);

    const aboutImage = c.about_image || '/assets/dilawar-ali.jpg';

    return (
        <>
            {/* Hero */}
            <section className="about-hero section-padding" style={{ paddingTop: '140px', background: 'var(--bg-dark)' }}>
                <div className="container">
                    <div className="about-grid">
                        <div className="about-text">
                            <span className="section-badge">{c.expertise_subtitle || 'Lead Visualizer'}</span>
                            <h1>{c.about_name || 'Dilawar Ali'}</h1>
                            <p className="about-title" style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                                {c.about_title || 'Lead Visualizer & Creative Director'}
                            </p>
                            <p>{c.about_bio1 || 'With 5+ years in architectural visualization, I bring architectural concepts to life through photorealistic renders and immersive walkthroughs.'}</p>
                            <p>{c.about_bio2 || 'Every project is approached with meticulous attention to detail — from lighting and materials to composition and storytelling.'}</p>
                            <p>{c.about_bio3 || 'My work has helped architects and developers across the Middle East and South Asia win clients and close projects.'}</p>

                            <div className="stats-row" style={{ display: 'flex', gap: '2rem', margin: '2.5rem 0', flexWrap: 'wrap' }}>
                                {[
                                    { label: 'Projects Completed', val: c.stat_projects || '200+' },
                                    { label: 'Happy Clients', val: c.stat_clients || '80+' },
                                    { label: 'Years Experience', val: c.stat_experience || '5+' },
                                ].map(s => (
                                    <div key={s.label} className="stat-item">
                                        <h3 style={{ color: 'var(--primary)', fontSize: '2rem' }}>{s.val}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            <Link href="/contact" className="btn btn-primary">Start a Project</Link>
                        </div>

                        <div className="about-image-wrapper">
                            <Image
                                src={optimizeCloudinaryUrl(aboutImage, 600)}
                                alt={c.about_name || 'Dilawar Ali - Lead Visualizer'}
                                width={500}
                                height={600}
                                style={{ objectFit: 'cover', borderRadius: '12px', width: '100%' }}
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Expertise */}
            <section className="section-padding" style={{ background: 'var(--bg-card)' }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                        <h2>{c.expertise_subtitle || 'What I Do'}</h2>
                    </div>
                    <div className="expertise-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                        {expertiseDefaults.map((ex, i) => (
                            <div key={i} className="skill-item" style={{ padding: '1.5rem', background: 'var(--bg-dark)', borderRadius: '10px', textAlign: 'center' }}>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
                                    {c[`expertise${i + 1}_title`] || ex.t}
                                </h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                    {c[`expertise${i + 1}_desc`] || ex.d}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tools */}
            <section className="section-padding">
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                        <h2>{c.tools_subtitle || 'My Arsenal'}</h2>
                    </div>
                    <div id="toolsGrid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                        {toolsList.map((tool: string) => (
                            <div key={tool} style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-dark)', border: '1px solid var(--border-dark)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: 'var(--primary)' }}>●</span> {tool}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow */}
            <section className="section-padding" style={{ background: 'var(--bg-card)' }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                        <h2>My Workflow</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ textAlign: 'center', padding: '2rem 1.5rem', background: 'var(--bg-dark)', borderRadius: '12px' }}>
                                <div className="timeline-badge" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--primary)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
                                    {i}
                                </div>
                                <h4 style={{ color: 'var(--text-white)', marginBottom: '0.5rem' }}>
                                    {c[`step${i}_title`] || ['Briefing & Concept', 'Modeling & Layout', 'Lighting & Materials', 'Final Rendering & Delivery'][i - 1]}
                                </h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                    {c[`step${i}_desc`] || ''}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
