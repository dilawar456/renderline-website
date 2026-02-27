import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Get in touch with RenderLine for your architectural visualization projects. Based in Lahore, Pakistan. WhatsApp: 0311-4544040.',
};

export default function ContactPage() {
    return (
        <>
            <div className="page-hero" style={{ background: 'var(--bg-card)' }}>
                <div className="container">
                    <span className="section-label">Let&apos;s Work Together</span>
                    <h1 className="section-title">Start Your <span className="gold">Project</span></h1>
                    <div className="gold-divider" style={{ margin: '1.25rem auto' }} />
                    <p className="section-desc" style={{ marginBottom: 0 }}>
                        Ready to bring your architectural vision to life? Reach out today.
                    </p>
                </div>
            </div>

            <section className="contact-section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Info */}
                        <div>
                            <div className="contact-info-block">
                                <h3>Email</h3>
                                <p><a href="mailto:inforenderline@gmail.com">inforenderline@gmail.com</a></p>
                            </div>
                            <div className="contact-info-block">
                                <h3>Location</h3>
                                <p>Lahore, Pakistan</p>
                            </div>
                            <div className="contact-info-block">
                                <h3>WhatsApp</h3>
                                <p>Fastest response — usually within an hour.</p>
                                <a
                                    href="https://wa.me/923114544040"
                                    className="btn btn-whatsapp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ marginTop: '1rem', display: 'inline-flex' }}
                                >
                                    Chat on WhatsApp
                                </a>
                            </div>
                            <div className="contact-info-block">
                                <h3>Working Hours</h3>
                                <p>Sunday – Thursday</p>
                                <p>9:00 AM – 6:00 PM (PKT)</p>
                            </div>
                        </div>

                        {/* Form */}
                        <ContactForm />
                    </div>
                </div>
            </section>
        </>
    );
}
