'use client';

import { useState, FormEvent } from 'react';
import { submitContactForm } from '@/lib/supabase';

export default function ContactForm() {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        const fd = new FormData(e.currentTarget);
        const formData = {
            name: fd.get('name') as string,
            email: fd.get('email') as string,
            phone: fd.get('phone') as string,
            project_type: fd.get('project_type') as string,
            message: fd.get('message') as string,
        };

        try {
            const { error } = await submitContactForm(formData);
            if (!error) {
                setSuccess(true);
            } else {
                // Fallback to WhatsApp
                const msg = `*New Project Inquiry*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone || 'N/A'}%0A*Project:* ${formData.project_type || 'Not specified'}%0A%0A*Message:*%0A${formData.message}`;
                window.open(`https://wa.me/923114544040?text=${msg}`, '_blank');
                setSuccess(true);
            }
        } catch {
            alert('Something went wrong. Please try WhatsApp instead.');
        } finally {
            setSubmitting(false);
        }
    }

    if (success) {
        return (
            <div className="contact-form-wrapper success-message">
                <h3>✓ Message Sent Successfully!</h3>
                <p>Thank you for reaching out! Dilawar Ali will review your project details and get back to you within 24 hours.</p>
                <a href="/" className="btn" style={{ marginTop: '1rem', display: 'inline-block' }}>Back to Home</a>
            </div>
        );
    }

    return (
        <div className="contact-form-wrapper">
            <form id="contactForm" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input type="text" id="name" name="name" required placeholder="Enter your full name" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input type="email" id="email" name="email" required placeholder="your@email.com" />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone / WhatsApp</label>
                    <input type="tel" id="phone" name="phone" placeholder="+92 3XX XXX XXXX" />
                </div>
                <div className="form-group">
                    <label htmlFor="project_type">Project Type</label>
                    <select id="project_type" name="project_type" style={{ width: '100%', padding: '1rem', background: 'var(--bg-card)', color: 'var(--text-light)', border: '1px solid var(--border-dark)', fontFamily: 'var(--font-body)', borderRadius: '8px' }}>
                        <option value="">Select a service...</option>
                        <option value="Exterior Visualization">Exterior Visualization</option>
                        <option value="Interior Visualization">Interior Visualization</option>
                        <option value="3D Animation / Walkthrough">3D Animation / Walkthrough</option>
                        <option value="Floor Plan Visualization">Floor Plan Visualization</option>
                        <option value="AutoCAD Architecture Drawings">AutoCAD Architecture Drawings</option>
                        <option value="Design & Construction Consultation">Design &amp; Construction Consultation</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="message">Project Details *</label>
                    <textarea id="message" name="message" rows={5} required placeholder="Tell us about your project: type, style, timeline, budget..." />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send Message'}
                </button>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>
                    By submitting, you agree to be contacted regarding your project.
                </p>
            </form>
        </div>
    );
}
