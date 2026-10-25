"use client";

import { useState } from "react";
import { projectWhatsAppUrl } from "@/lib/whatsapp";
import { recordWhatsAppContact } from "@/lib/contact-tracking";

const inputStyle = "w-full";
const labelStyle = "block mb-2";

export default function ContactForm({
  whatsappNumber,
}: {
  whatsappNumber: string;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
  });
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    recordWhatsAppContact("contact_form");
    window.location.assign(projectWhatsAppUrl(whatsappNumber, formData));
  };
  return (
    <div className="rl-contact-form">
      <h2 className="text-2xl mb-2">Tell us about your project.</h2>
      <p className="text-[#65717b] text-sm leading-relaxed mb-8">
        Share a few details, then continue the conversation on WhatsApp.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rl-form-grid">
          <div>
            <label htmlFor="name" className={labelStyle}>
              Your name *
            </label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelStyle}>
              Email address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelStyle}>
              Phone / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+92 …"
              className={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="projectType" className={labelStyle}>
              Service
            </label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select a service</option>
              {[
                "Exterior Visualization",
                "Interior Design",
                "3D Walkthrough",
                "Dimensioned House Plans",
                "Architectural Booklet",
                "Working Drawings",
                "Other",
              ].map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="message" className={labelStyle}>
            Project details *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="What are you designing? Share the scope, references and timeline."
            className={`${inputStyle} resize-y`}
          />
        </div>
        <button type="submit" className="rl-button w-full">
          Continue on WhatsApp ↗
        </button>
        <p className="text-center text-[#65717b] text-xs leading-relaxed">
          Your details open in WhatsApp. Tap Send there to deliver your message.
        </p>
      </form>
    </div>
  );
}
