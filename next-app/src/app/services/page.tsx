import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteContent } from '@/lib/supabase';
import ServicesGridClient from './ServicesGridClient';
import { getWorkflowPictures } from '@/lib/workflow-pictures';

export const metadata: Metadata = {
    title: 'Services',
    description: 'RenderLine offers professional architectural visualization services including exterior & interior 3D rendering, walkthroughs, floor plans, and AutoCAD drawings.',
};

export const revalidate = 60;

const serviceDefaults = [
    { title: 'Exterior Visualization', icon: '🏛️', desc: 'Photorealistic exterior renders of villas, towers, and commercial buildings.' },
    { title: 'Interior Visualization', icon: '🛋️', desc: 'Luxury residential and commercial interior renders.' },
    { title: '3D Animation', icon: '🎬', desc: 'Cinematic walkthrough animations for real estate marketing.' },
    { title: 'Floor Plan Rendering', icon: '📐', desc: '2D & 3D floor plan visualizations with furniture and finishes.' },
    { title: 'Architectural Drawings', icon: '📐', desc: 'Clear floor plans, elevations, sections and drawing sheets prepared from your design brief.' },
    { title: 'Design Consultation', icon: '💡', desc: 'Expert design guidance for your project from concept to completion.' },
];
const workflowIds = ['exterior', 'interior', 'walkthrough', 'plans', 'drawings', 'consultation'];

export default async function ServicesPage() {
    const { data: content } = await getSiteContent();
    const c = content || {};

    return (
        <div className="bg-[#050505] min-h-screen text-gray-300">
            {/* Hero Section */}
            <section className="relative pt-36 pb-16 lg:pt-40 lg:pb-20 border-b border-[#ad8d58]/20 bg-[#11120f] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,175,55,0.08),_transparent_60%)] pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                    <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-semibold mb-7 block">RENDERLINE / WHAT WE DO</span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 max-w-5xl leading-[1.05]">
                        {c.services_heading || 'Our Services'}
                    </h1>
                    <div className="h-px w-full bg-gradient-to-r from-[var(--gold)]/70 via-white/15 to-transparent mb-8" />
                    <p className="text-base md:text-lg text-[#b9b8b0] max-w-2xl leading-relaxed">
                        {String(c.services_subheading || '').includes('Premium architectural visualization solutions tailored') ? 'Choose a service to see what you provide, what our team creates and when you review it.' : c.services_subheading || 'Choose a service to see what you provide, what our team creates and when you review it.'}
                    </p>
                    <Link href="#services-list" className="inline-flex items-center gap-3 border-b border-[var(--gold)] pb-2 mt-9 text-[var(--gold)] text-xs font-bold uppercase tracking-[0.2em] hover:text-white">Choose a service <span aria-hidden="true">↗</span></Link>
                </div>
            </section>

            {/* Services Grid Section */}
            <section id="services-list" className="py-14 bg-[#050505] scroll-mt-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <ServicesGridClient services={serviceDefaults.map((def, i) => {
                        const num = i + 1;
                        return {
                            title: num===5 && /^autocad drawings?$/i.test(String(c[`service${num}_title`] || '').trim()) ? 'Architectural Drawings' : c[`service${num}_title`] || def.title,
                            desc: num===5 && /^professional 2d drafting and technical drawings\.?$/i.test(String(c[`service${num}_desc`] || '').trim()) ? def.desc : c[`service${num}_desc`] || def.desc,
                            icon: c[`service${num}_icon`] || def.icon,
                            imgUrl: c[`cloudinary_service${num}`] || null,
                            stepImages: getWorkflowPictures(workflowIds[i]),
                        };
                    })} />
                </div>
            </section>

        </div>
    );
}

