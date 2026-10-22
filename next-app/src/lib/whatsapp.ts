export type ProjectEnquiry = { name: string; email: string; phone: string; projectType: string; message: string };

export function projectWhatsAppUrl(number: string, enquiry: ProjectEnquiry): string {
  const phone = number.replace(/\D/g, '');
  const lines = [
    'Hello RenderLine, I would like to discuss a project.',
    `Name: ${enquiry.name.trim()}`,
    `Email: ${enquiry.email.trim()}`,
    enquiry.phone.trim() ? `Phone: ${enquiry.phone.trim()}` : '',
    enquiry.projectType ? `Service: ${enquiry.projectType}` : '',
    'Project details:',
    enquiry.message.trim(),
  ];
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.filter(Boolean).join('\n'))}`;
}
