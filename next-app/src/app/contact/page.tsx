import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/supabase';
import ContactForm from './ContactForm';
import WhatsAppLink from '@/components/WhatsAppLink';
import { publicContactEmail, publicPhoneDisplay, publicWhatsAppNumber } from '@/lib/public-contact';

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
    title: 'Contact',
    description: 'Get in touch with RenderLine to discuss your next architectural visualization project.',
};

export const revalidate = 60;
export default async function ContactPage() {
    const {data} = await getSiteContent();
    const c=data||{};
    const email=publicContactEmail(c.contact_email);
    const phone=publicWhatsAppNumber(c.contact_whatsapp);
    return (
        <div className="bg-[#0d120e] min-h-screen pt-36 pb-24">
            <div className="container mx-auto px-6 max-w-6xl">
                
                {/* Header */}
                <div className="grid md:grid-cols-[1.25fr_.75fr] gap-8 md:gap-16 items-end mb-14 pb-10 border-b border-[#b7a06b]/30 reveal-up">
                    <div><span className="block text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-semibold mb-6">RENDERLINE / START A PROJECT</span><h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.05]">
                        {String(c.contact_heading || '').trim().toLowerCase()==='get in touch' ? 'Let’s discuss your project.' : c.contact_heading || 'Let’s discuss your project.'}
                    </h1></div>
                    <div><p className="text-[#c6c7bb] text-base leading-relaxed mb-5">
                        {c.contact_subheading || 'Tell us what you are designing, what is already decided and what you need help presenting.'}
                    </p><span className="text-[#b7a06b] text-xs tracking-[0.2em] uppercase">Drawings · Visuals · Walkthroughs</span></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Column: Form Box */}
                    <div className="w-full lg:w-[60%] reveal-up stagger-2">
                        <ContactForm whatsappNumber={phone} />
                    </div>

                    {/* Right Column: Info Boxes */}
                    <div className="w-full lg:w-[40%] space-y-6 reveal-up stagger-3">
                        
                        {/* Contact Details */}
                        <div className="bg-[#171d17] border border-[#b7a06b]/25 p-6 rounded-sm">
                            <h3 className="text-[var(--gold)] text-xs font-bold tracking-widest uppercase mb-4">Contact Details</h3>
                            
                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-400 text-xs font-bold mb-1">Email:</p>
                                    <a href={`mailto:${email}`} className="text-[var(--gold)] text-sm font-semibold hover:underline">
                                        {email}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs font-bold mb-1">Phone:</p>
                                    <a href={`tel:+${phone}`} className="text-[var(--gold)] text-sm font-semibold hover:underline">
                                        {publicPhoneDisplay(c.contact_phone_display, phone)}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs font-bold mb-1">Location:</p>
                                    <p className="text-gray-400 text-sm">{c.contact_location || 'Lahore, Pakistan'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Chat */}
                        <div className="bg-[#171d17] border border-[#b7a06b]/25 p-6 rounded-sm">
                            <h3 className="text-[var(--gold)] text-xs font-bold tracking-widest uppercase mb-3">Quick Chat</h3>
                            <p className="text-gray-400 text-xs leading-relaxed mb-4">
                                Prefer WhatsApp? Click below for a quick response.
                            </p>
                            <WhatsAppLink
                                number={phone}
                                source="contact_quick_chat"
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full text-center border border-[#1d8a3a] text-[#25D366] font-bold text-xs uppercase tracking-widest py-3 hover:bg-[#1d8a3a]/10 transition-colors"
                            >
                                Chat on WhatsApp
                            </WhatsAppLink>
                        </div>

                        {/* Working Hours */}
                        <div className="bg-[#171d17] border border-[#b7a06b]/25 p-6 rounded-sm">
                            <h3 className="text-[var(--gold)] text-xs font-bold tracking-widest uppercase mb-3">Working Hours</h3>
                            <p className="text-gray-300 text-sm mb-2">Saturday – Thursday: 9AM – 6PM</p>
                            <p className="text-[var(--gold)] text-sm">Friday: Closed</p>
                        </div>

                        {/* Follow Us */}
                        <div className="bg-[#171d17] border border-[#b7a06b]/25 p-6 rounded-sm">
                            <h3 className="text-[var(--gold)] text-xs font-bold tracking-widest uppercase mb-3">Follow Us</h3>
                            <p className="text-gray-400 text-xs mb-4">Connect with us on social media</p>
                            
                            <div className="flex gap-4"><a href="https://instagram.com/renderline.arch" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)]">Instagram ↗</a>
                                </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
