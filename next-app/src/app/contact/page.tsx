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
            <header className="section-padding" style={{ paddingTop: '150px' }}>
                <div className="container text-center">
                    <h1 className="primary">Start Your Project</h1>
                    <p style={{ maxWidth: '500px', margin: '0 auto' }}>
                        Ready to bring your architectural vision to life? Get in touch today.
                    </p>
                </div>
            </header>

            <section className="section-padding" style={{ paddingTop: '2rem' }}>
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Info */}
                        <div className="contact-info">
                            <div className="info-block">
                                <h3>Contact Details</h3>
                                <p>
                                    <strong>Email:</strong><br />
                                    <a href="mailto:inforenderline@gmail.com" style={{ color: 'var(--primary)' }}>
                                        inforenderline@gmail.com
                                    </a>
                                </p>
                                <p><strong>Location:</strong><br />Lahore, Pakistan</p>
                            </div>
                            <div className="info-block">
                                <h3>Quick Chat</h3>
                                <p>Prefer WhatsApp? Click below for a quick response.</p>
                                <a
                                    href="https://wa.me/923114544040"
                                    className="btn btn-whatsapp"
                                    style={{ marginTop: '1rem', display: 'inline-block' }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Chat on WhatsApp
                                </a>
                            </div>
                            <div className="info-block">
                                <h3>Working Hours</h3>
                                <p>Sunday – Thursday: 9AM – 6PM</p>
                                <p>Response within 24 hours</p>
                            </div>
                        </div>

                        {/* Contact Form — Client Component */}
                        <ContactForm />
                    </div>
                </div>
            </section>
        </>
    );
}
