'use client';

import { useState } from 'react';
import { projectWhatsAppUrl } from '@/lib/whatsapp';
import { recordWhatsAppContact } from '@/lib/contact-tracking';

const inputStyle = 'w-full rounded-md bg-[#0d120e] border border-[#465045] text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors';
const labelStyle = 'block text-[#e8e5d9] text-sm mb-2';

export default function ContactForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', projectType: '', message: '' });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    recordWhatsAppContact('contact_form');
    window.location.assign(projectWhatsAppUrl(whatsappNumber, formData));
  };
  return <div className="bg-[#171d17] border border-[#b7a06b]/25 p-6 md:p-9 rounded-lg">
    <h2 className="text-white text-2xl font-serif mb-2">Tell us about your project.</h2>
    <p className="text-[#aeb9ac] text-sm leading-relaxed mb-8">Share a few details, then continue the conversation on WhatsApp.</p>
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div><label htmlFor="name" className={labelStyle}>Your name *</label><input id="name" name="name" autoComplete="name" required value={formData.name} onChange={handleChange} placeholder="Your full name" className={inputStyle} /></div>
        <div><label htmlFor="email" className={labelStyle}>Email address *</label><input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} placeholder="your@email.com" className={inputStyle} /></div>
        <div><label htmlFor="phone" className={labelStyle}>Phone / WhatsApp</label><input id="phone" name="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={handleChange} placeholder="+92 …" className={inputStyle} /></div>
        <div><label htmlFor="projectType" className={labelStyle}>Service</label><select id="projectType" name="projectType" value={formData.projectType} onChange={handleChange} className={inputStyle}>
          <option value="">Select a service</option>
          {['Exterior Visualization', 'Interior Design', '3D Walkthrough', 'Floor Plan Visuals', 'Architectural Drawings', 'Design Consultation', 'Other'].map((service) => <option key={service} value={service}>{service}</option>)}
        </select></div>
      </div>
      <div><label htmlFor="message" className={labelStyle}>Project details *</label><textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="What are you designing? Share the scope, references and timeline." className={`${inputStyle} resize-y`} /></div>
      <button type="submit" className="w-full rounded-md bg-[var(--gold)] text-black font-semibold text-sm py-4 hover:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]">Continue on WhatsApp ↗</button>
      <p className="text-center text-[#aeb9ac] text-xs leading-relaxed">Your details open in WhatsApp. Tap Send there to deliver your message.</p>
    </form>
  </div>;
}
