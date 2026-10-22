'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { optimizeCloudinaryUrl } from '@/lib/media';
import VisualProcess from '@/components/VisualProcess';

interface Service { title: string; icon: string; desc: string; imgUrl: string | null; stepImages: (string | null)[] }
const processIds = ['exterior', 'interior', 'walkthrough', 'plans', 'drawings', 'consultation'];

export default function ServicesGridClient({ services }: { services: Service[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('service');
    const index = processIds.indexOf(requested || '');
    if (index < 0) return;
    const frame = window.requestAnimationFrame(() => setActiveIndex(index));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (activeIndex !== null) detailRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }, [activeIndex]);
  const closeDetail = () => {
    const card = document.getElementById(`service-card-${activeIndex}`);
    setActiveIndex(null);
    card?.focus({ preventScroll: true });
    card?.scrollIntoView({ behavior: 'auto', block: 'center' });
  };
  return <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index) => <button id={`service-card-${index}`} key={service.title} type="button" onClick={() => setActiveIndex(index)} aria-expanded={activeIndex === index} aria-controls={activeIndex === index ? 'service-detail' : undefined} className={`text-left flex flex-col rounded-xl border bg-[#111812] overflow-hidden group motion-safe:hover:-translate-y-1 hover:border-[#b7a06b] hover:shadow-[0_12px_30px_#0006] transition-[transform,border-color,box-shadow] duration-300 motion-reduce:transition-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)] ${activeIndex === index ? 'border-[#d0ae70]' : 'border-[#465045]'}`}>
        <div className="relative aspect-[3/2] overflow-hidden bg-[#1a231b]">
          {service.imgUrl ? <Image src={optimizeCloudinaryUrl(service.imgUrl, 600)} alt={service.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 motion-reduce:transition-none opacity-85 group-hover:opacity-100" loading="lazy" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"/> : <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">{service.icon}</div>}
          <span className="absolute top-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-[10px] tracking-[.16em] text-white backdrop-blur-sm">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="flex flex-col flex-1 p-6">
          <h2 className="text-xl md:text-2xl text-white mb-3 group-hover:text-[var(--gold)] transition-colors">{service.title}</h2>
          <p className="text-[#aeb9ac] leading-relaxed text-sm flex-1">{service.desc}</p>
          <div className="border-t border-white/15 mt-6 pt-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[.14em] text-[var(--gold)]"><span>Details & process</span><span aria-hidden="true">↗</span></div>
        </div>
      </button>)}
    </div>
    {activeIndex !== null && <div ref={detailRef} className="mt-10 scroll-mt-24 rounded-xl border border-[#806e4b] bg-[#111812] overflow-hidden">
      <div className="flex justify-end px-5 pt-4"><button type="button" onClick={closeDetail} className="text-[#c6c7bb] text-sm px-3 py-2 hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--gold)]">Close details ×</button></div>
      <VisualProcess key={processIds[activeIndex]} embeddedService={processIds[activeIndex]} title={services[activeIndex].title} stepImages={services[activeIndex].stepImages} finalImage={services[activeIndex].imgUrl} />
    </div>}
  </>;
}
