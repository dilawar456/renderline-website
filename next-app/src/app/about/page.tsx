import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getSiteContent, optimizeCloudinaryUrl } from '@/lib/supabase';

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
    title: 'About',
    description: 'Learn about Dilawar Ali and RenderLine — a premium architectural visualization and 3D rendering studio.',
};

export const revalidate = 60;

export default async function AboutPage() {
    const { data: content } = await getSiteContent();
    const c = content || {};

    const aboutImage = c.about_image || '/assets/dilawar-ali.jpg';
    
    const legacyBio = String(c.about_bio1 || c.about_bio || '').startsWith('Welcome to RenderLine');
    const bio = legacyBio ? [
        'RenderLine is an architectural visualization studio led by Dilawar Ali. We turn drawings and design intent into clear, convincing imagery for architects, developers and their clients.',
        'Our work covers exterior and interior renders, walkthroughs, and presentation drawings. Every image is built around the project’s proportions, materials, light and context.',
        'We review source files and references first, share the visual direction, and keep feedback tied to the design so decisions stay clear throughout the project.'
    ] : [c.about_bio1 || c.about_bio || 'RenderLine creates architectural visualizations with clarity, precision and care.', c.about_bio2 || 'We help architects and developers present design ideas with confidence.', c.about_bio3].filter(Boolean);

    // Match older CMS titles to useful descriptions when their dedicated description is empty.
    const expertiseDescription = (title:string, fallback:string) => {
        const name=title.toLowerCase();
        if(name.includes('commercial building'))return 'Offices, retail and mixed-use projects';
        if(name.includes('luxury interior'))return 'Materials, furniture and lighting studies';
        if(name.includes('landscape'))return 'Outdoor settings and site context';
        if(name.includes('aerial'))return 'Masterplans and elevated views';
        if(name.includes('night'))return 'After-dark lighting and atmosphere';
        if(name.includes('virtual tour'))return 'Immersive, client-friendly walkthroughs';
        if(name.includes('residential exterior'))return 'Villas, façades and housing developments';
        return fallback;
    };

    // Areas of Expertise for About Page
    const expertiseItems = [
        { title: 'Exterior Visualization', icon: '🏠', desc: 'Villas, towers, facades' },
        { title: 'Interior Design', icon: '🛋️', desc: 'Luxury residential & commercial' },
        { title: '3D Walkthroughs', icon: '🎬', desc: 'Cinematic animations' },
        { title: 'Aerial & Drone Views', icon: '🚁', desc: "Bird's eye perspectives" },
        { title: 'Night & Dusk Scenes', icon: '🌙', desc: 'Dramatic lighting' },
        { title: 'Commercial Spaces', icon: '🏢', desc: 'Offices, retail, hotels' },
        { title: 'Floor Plans', icon: '📐', desc: '2D & 3D layouts' },
        { title: 'Real Estate Marketing', icon: '🎯', desc: 'Sales-ready visuals' },
    ];

    const defaultTools = [
        "3ds Max", "V-Ray", "Corona Renderer", "Lumion", "D5 Render", 
        "Unreal Engine 5", "Enscape", "Twinmotion", "AutoCAD", "SketchUp", 
        "Revit", "Blender", "Photoshop", "After Effects", "AI Tools"
    ];

    const tools: string[] = c.tools_list ? c.tools_list.split(',').map((v:string)=>v.trim()).filter(Boolean) : defaultTools;

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-gray-300">
            {/* Hero / About Bio Section */}
            <section className="pt-32 pb-20 border-b border-[#1a1a1a]">
                <div className="container mx-auto px-6 max-w-[1100px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        {/* Left Side: Image */}
                        <div className="relative w-full max-w-md mx-auto reveal-up">
                            <div className="relative aspect-square md:aspect-[4/5] bg-black border border-[#222]">
                                <Image
                                    src={optimizeCloudinaryUrl(aboutImage, 800)}
                                    alt={c.about_name || 'Dilawar Ali'}
                                    fill
                                    className="object-cover relative z-10"
                                    sizes="(max-width: 768px) 90vw, 450px"
                                    loading="eager"
                                    priority
                                />
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-[var(--gold)] text-black font-bold tracking-widest uppercase text-[10px] px-6 py-2 whitespace-nowrap shadow-xl">
                                    {c.expertise_subtitle || 'Lead Visualizer'}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Bio & Stats */}
                        <div className="reveal-up stagger-2 pl-0 md:pl-4">
                            <div className="text-center md:text-left mb-8 border-b border-[#222] pb-6">
                                <h1 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-widest mb-3">
                                    {c.about_name || 'Dilawar Ali'}
                                </h1>
                                <p className="text-[var(--gold)] text-[10px] font-bold tracking-[0.2em] uppercase">
                                    {c.about_title || 'Founder & Creative Director'}
                                </p>
                            </div>

                            <div className="space-y-6 text-sm md:text-base text-[#b7b9b0] leading-relaxed mb-10">
                                {bio.map((paragraph:string,index:number)=><p key={index}>{paragraph}</p>)}
                            </div>

                            <div className="border-t border-[#333] pt-8 flex justify-between items-center max-w-[350px] mx-auto md:mx-0 text-center">
                                <div>
                                    <div className="text-3xl font-serif text-[var(--gold)] mb-1">{c.stat_projects || '200+'}</div>
                                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">Projects Delivered</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-serif text-[var(--gold)] mb-1">{c.stat_clients || '50+'}</div>
                                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">Happy Clients</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-serif text-[var(--gold)] mb-1">{c.stat_experience || '5+'}</div>
                                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">Years Experience</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Areas of Expertise Grid */}
            <section className="py-24 bg-[#0a0a0a] border-b border-[#1a1a1a]">
                <div className="container mx-auto px-6 max-w-[1100px]">
                    <div className="text-center mb-16 reveal-up">
                        <span className="text-[var(--gold)] text-[10px] font-bold tracking-[0.2em] uppercase block mb-3">What I Do</span>
                        <h2 className="text-3xl font-serif text-white tracking-widest uppercase">
                            Areas of <span className="text-[var(--gold)]">Expertise</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {expertiseItems.map((item, i) => (
                            <div key={i} className="bg-[#131712] border-t border-[#b19a67]/50 p-7 min-h-48 hover:bg-[#1b221a] transition-colors group">
                                <div className="text-[var(--gold)] text-xs tracking-[0.22em] mb-8">{String(i+1).padStart(2,'0')} / EXPERTISE</div>
                                <h3 className="text-white text-sm font-semibold tracking-[0.08em] uppercase mb-3 leading-snug">{c[`expertise${i+1}_title`] || c[`expertise${i+1}`] || item.title}</h3>
                                <p className="text-[#a8ada5] text-xs leading-relaxed">{c[`expertise${i+1}_desc`] || expertiseDescription(c[`expertise${i+1}_title`] || c[`expertise${i+1}`] || item.title, item.desc)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tools & Technologies */}
            <section className="py-24 bg-[#0a0a0a] border-b border-[#1a1a1a]">
                <div className="container mx-auto px-6 max-w-[900px] text-center">
                    <div className="mb-16 reveal-up">
                        <span className="text-[var(--gold)] text-[10px] font-bold tracking-[0.2em] uppercase block mb-3">My Arsenal</span>
                        <h2 className="text-3xl font-serif text-white tracking-widest uppercase">
                            Tools & <span className="text-[var(--gold)]">Technologies</span>
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 reveal-up stagger-2">
                        {tools.map((tool, i) => (
                            <div key={i} className="px-5 py-2.5 border border-[#333] bg-[#111] text-white text-xs font-semibold hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors cursor-default">
                                {tool}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-[#111811] border-t border-[#b19a67]/20">
                <div className="container mx-auto px-6 max-w-[1100px] flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div><span className="text-[var(--gold)] text-xs tracking-[0.24em] uppercase font-semibold">HOW WE WORK</span><h2 className="font-serif text-white text-4xl md:text-5xl mt-5 max-w-xl">A clear process for every project.</h2><p className="text-[#adb5a9] mt-5 max-w-xl leading-relaxed">Explore each service from the first brief to the final handover, including the decisions you make at every stage.</p></div>
                    <Link href="/services#services-list" className="text-[var(--gold)] text-xs tracking-[0.2em] uppercase font-bold border-b border-[var(--gold)] pb-2 whitespace-nowrap">Explore our process ↗</Link>
                </div>
            </section>
        </div>
    );
}
