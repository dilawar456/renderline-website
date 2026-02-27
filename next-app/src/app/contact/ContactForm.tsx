'use client';

import { useState, FormEvent } from 'react';
import { submitContactForm } from '@/lib/supabase';

const services = [
    'Exterior Visualization',
    'Interior Visualization',
    '3D Animation / Walkthrough',
    'Floor Plan Visualization',
    'AutoCAD Architecture Drawings',
    'Design & Construction Consultation',
    'Other',
];

export default function ContactForm() {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        const fd = new FormData(e.currentTarget);
        const data = {
            name: fd.get('name') as string,
            email: fd.get('email') as string,
            phone: fd.get('phone') as string,
            project_type: fd.get('project_type') as string,
            message: fd.get('message') as string,
        };

        try {
            const { error } = await submitContactForm(data);
            if (!error) {
                setSuccess(true);
            } else {
                const msg = `*New Project Inquiry*%0A%0A*Name:* ${data.name}%0A*Email:* ${data.email}%0A*Phone:* ${data.phone || 'N/A'}%0A*Project:* ${data.project_type || 'Not specified'}%0A%0A*Message:*%0A${data.message}`;
                window.open(`https://wa.me/923114544040?text=${msg}`, '_blank');
                setSuccess(true);
            }
        } catch {
            alert('Something went wrong. Please try WhatsApp.');
        } finally {
            setSubmitting(false);
        }
    }

    if (success) {
        return (
            <div className="form-card">
                <div className="success-state">
                    <div className="check-circle">✓</div>
                    <h3>Message Sent!</h3>
                    <p>Thank you for reaching out. Dilawar Ali will review your project and get back to you within 24 hours.</p>
                    <a href="/" className="btn btn-outline">Back to Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="form-card">
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input type="text" id="name" name="name" required placeholder="Your full name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input type="email" id="email" name="email" required placeholder="your@email.com" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="phone">WhatsApp / Phone</label>
                        <input type="tel" id="phone" name="phone" placeholder="+92 3XX XXXXXXX" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="project_type">Project Type</label>
                        <select id="project_type" name="project_type">
                            <option value="">Select a service...</option>
                            {services.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="message">Project Details *</label>
                    <textarea
                        id="message" name="message" rows={5} required
                        placeholder="Tell us about your project: type, style, timeline, budget..."
                    />
                </div>

                <button type="submit" className="btn btn-primary form-submit" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send Message →'}
                </button>
                <p className="form-note">By submitting, you agree to be contacted about your project.</p>
            </form>
        </div>
    );
}
