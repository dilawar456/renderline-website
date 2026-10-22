import Image from 'next/image';
import Link from 'next/link';

const serviceDefaults = [
  {
    id: 'exterior',
    title: 'Exterior Visualization',
    icon: '🏛️',
    desc: 'Photorealistic exterior renders of villas, towers, and commercial buildings.',
  },
  {
    id: 'interior',
    title: 'Interior Visualization',
    icon: '🛋️',
    desc: 'Luxury residential and commercial interior renders.',
  },
  {
    id: 'walkthrough',
    title: '3D Animation',
    icon: '🎬',
    desc: 'Cinematic walkthrough animations for real estate marketing.',
  },
  {
    id: 'plans',
    title: 'Floor Plan Rendering',
    icon: '📐',
    desc: '2D & 3D floor plan visualizations with furniture and finishes.',
  },
  {
    id: 'drawings',
    title: 'Architectural Drawings',
    icon: '📐',
    desc: 'Clear floor plans, elevations, sections and drawing sheets prepared from your design brief.',
  },
  {
    id: 'consultation',
    title: 'Design Consultation',
    icon: '💡',
    desc: 'Expert design guidance for your project from concept to completion.',
  },
];

export default function ServicesPreviewSection({ content }: { content: Record<string, string> }) {
  return (
    <section
      aria-labelledby="home-services-heading"
      className="border-t border-[#b9a16e]/20 bg-[#101711] px-6 py-20 text-white md:py-24"
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-[.24em] text-[var(--gold)]">WHAT WE DO</span>
            <h2 id="home-services-heading" className="mt-4 font-serif text-4xl md:text-6xl">
              {content.services_heading || 'Our services.'}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#b8c3b5] md:text-base">
              {content.services_subheading || 'From the first drawing to the final render, explore the ways we can bring your project into focus.'}
            </p>
          </div>
          <Link
            href="/services"
            className="self-start border-b border-[var(--gold)] pb-2 text-xs font-bold uppercase tracking-[.18em] text-[var(--gold)] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)] md:self-end"
          >
            View all services <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceDefaults.map((service, index) => {
            const num = index + 1;
            const configuredTitle = content[`service${num}_title`];
            const configuredDesc = content[`service${num}_desc`];
            const title = num === 5 && /^autocad drawings?$/i.test(String(configuredTitle || '').trim())
              ? service.title
              : configuredTitle || service.title;
            const desc = num === 5 && /^professional 2d drafting and technical drawings\.?$/i.test(String(configuredDesc || '').trim())
              ? service.desc
              : configuredDesc || service.desc;
            const icon = content[`service${num}_icon`] || service.icon;
            const imageUrl = content[`cloudinary_service${num}`];

            return (
              <Link
                key={service.id}
                href={`/services?service=${service.id}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-[#465045] bg-[#172019] transition-[transform,border-color] duration-300 hover:border-[#b9a16e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)] motion-safe:hover:-translate-y-1 motion-reduce:transition-none"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#1c291e]">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc((100vw - 68px) / 2), (max-width: 1347px) calc((100vw - 88px) / 3), 420px"
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                    />
                  ) : (
                    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_rgba(185,161,110,0.12),_transparent_70%)]">
                      <div className="absolute inset-6 rounded-full border border-[#b9a16e]/15" />
                      <div className="absolute inset-12 border border-[#b9a16e]/15" />
                      <span className="relative text-6xl">{icon}</span>
                    </div>
                  )}
                  <span aria-hidden="true" className="absolute left-4 top-4 rounded-full bg-[#0a0e0b]/75 px-3 py-1.5 text-[10px] font-semibold tracking-[.16em] backdrop-blur-sm">
                    {String(num).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl leading-snug transition-colors group-hover:text-[var(--gold)] md:text-2xl">{title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#b8c3b5]">{desc}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-xs font-semibold uppercase tracking-[.14em] text-[var(--gold)]">
                    <span>Details &amp; process</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
