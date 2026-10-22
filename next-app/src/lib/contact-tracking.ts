export const WHATSAPP_CONTACT_EVENT = 'renderline:whatsapp-contact';

const contactSources = ['contact_form', 'contact_quick_chat', 'floating_button', 'home_cta', 'footer_social', 'footer_phone'] as const;
export type WhatsAppContactSource = typeof contactSources[number];

export function isPrivateAnalyticsPage(pathname: string) {
  return pathname.startsWith('/portal') || pathname.startsWith('/admin');
}

export function recordWhatsAppContact(source: WhatsAppContactSource) {
  if (typeof window === 'undefined' || isPrivateAnalyticsPage(window.location.pathname)) return;
  // The outbound URL can contain private enquiry text. Only send the fixed UI source.
  window.dispatchEvent(new CustomEvent(WHATSAPP_CONTACT_EVENT, { detail: { source } }));
}

type AnalyticsFunction = (...args: unknown[]) => void;
type ContactAnalyticsOptions = {
  enabled: boolean;
  consent: string | null;
  pathname: string;
  meta?: AnalyticsFunction;
  google?: AnalyticsFunction;
};

export function reportWhatsAppContact(event: Event, options: ContactAnalyticsOptions) {
  if (!options.enabled || options.consent !== 'yes' || isPrivateAnalyticsPage(options.pathname)) return;
  const detail = (event as CustomEvent<unknown>).detail;
  if (!detail || typeof detail !== 'object') return;
  const source = (detail as Record<string, unknown>).source;
  if (!contactSources.some((allowed) => allowed === source)) return;

  // Contact records intent. Opening WhatsApp cannot confirm that a message was sent.
  const parameters = {
    contact_method: 'whatsapp',
    contact_source: source,
    contact_action: source === 'contact_form' ? 'form_handoff' : 'chat_click',
  };
  options.meta?.('track', 'Contact', parameters);
  options.google?.('event', 'contact', parameters);
}
