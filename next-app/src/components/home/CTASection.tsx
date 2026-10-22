import Link from 'next/link';
import WhatsAppLink from '@/components/WhatsAppLink';

export default function CTASection({ content }: { content: Record<string, string> }) {
  const legacyHeading = String(content.cta_heading || '').toLowerCase().includes('ready to visualize');
  const heading = legacyHeading ? 'Ready to make it clear?' : content.cta_heading || 'Ready to make it clear?';
  const legacyText = String(content.cta_text || '').toLowerCase().includes('free consultation and custom quote');
  const description = legacyText ? 'Send your plan, sketch or references. We will help define the right next step.' : content.cta_text || 'Send your plan, sketch or references. We will help define the right next step.';
  return <section className="bg-[#18231b] text-white py-24 px-6 border-t border-[#bea875]/25"><div className="max-w-[1300px] mx-auto grid md:grid-cols-[1.2fr_.8fr] items-end gap-10"><div><span className="text-[var(--gold)] text-xs font-bold tracking-[.24em] uppercase">START A PROJECT</span><h2 className="font-serif text-5xl md:text-7xl mt-5 leading-[1.05]">{heading}</h2></div><div><p className="text-[#bdc7bb] leading-relaxed mb-8">{description}</p><div className="flex flex-wrap items-center gap-6"><Link href="/contact" className="bg-[#d0ae70] text-[#172219] px-6 py-4 text-xs font-bold uppercase tracking-[.16em] hover:bg-[#edd49a] transition-colors">Contact RenderLine ↗</Link><WhatsAppLink number={content.contact_whatsapp} source="home_cta" className="text-[#d0ae70] border-b border-[#d0ae70] pb-2 text-xs font-bold uppercase tracking-[.16em]">WhatsApp ↗</WhatsAppLink></div></div></div></section>;
}
