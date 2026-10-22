import Link from 'next/link';
import Image from 'next/image';
import { optimizeCloudinaryUrl } from '@/lib/media';

interface PortfolioPreviewSectionProps {
  previewItems: { id: string | number; image_url: string; title: string }[];
}

export default function PortfolioPreviewSection({ previewItems }: PortfolioPreviewSectionProps) {
  return <section className="bg-[#0a0e0b] text-white px-6 py-24 border-t border-[#b9a16e]/20">
    <div className="max-w-[1300px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10"><div><span className="text-[var(--gold)] text-xs font-bold tracking-[.24em]">SELECTED VISUALIZATIONS</span><h2 className="font-serif text-4xl md:text-6xl mt-4">Our portfolio.</h2></div><Link href="/portfolio" className="text-[var(--gold)] text-xs uppercase tracking-[.18em] font-bold border-b border-[var(--gold)] pb-2 self-start md:self-end">View full portfolio ↗</Link></div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">{previewItems.slice(0, 6).map((item, index) => <Link href="/portfolio" aria-label={`View portfolio image ${index + 1}`} key={item.id} className="group relative block overflow-hidden rounded-lg border border-[#465045] bg-[#172019] focus-visible:outline-2 focus-visible:outline-[var(--gold)]"><div className="relative aspect-[4/3] overflow-hidden"><Image src={optimizeCloudinaryUrl(item.image_url, 800)} alt={item.title || `RenderLine visualization ${index + 1}`} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-105" loading="lazy" unoptimized /></div><span aria-hidden="true" className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">↗</span></Link>)}</div>
    </div>
  </section>;
}
