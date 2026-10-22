import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recordWhatsAppContact, reportWhatsAppContact, WHATSAPP_CONTACT_EVENT } from '../src/lib/contact-tracking.ts';

test('One WhatsApp activation reports contact intent only after consent and enabled tracking', () => {
  const browser = new EventTarget();
  browser.location = { pathname: '/contact' };
  const originalWindow = globalThis.window;
  globalThis.window = browser;
  try {
    const meta = [], google = [];
    const options = { enabled: true, consent: null, pathname: '/contact', meta: (...args) => meta.push(args), google: (...args) => google.push(args) };
    browser.addEventListener(WHATSAPP_CONTACT_EVENT, (event) => reportWhatsAppContact(event, options));
    recordWhatsAppContact('contact_form');
    options.consent = 'no';
    recordWhatsAppContact('contact_form');
    options.consent = 'yes';
    options.enabled = false;
    recordWhatsAppContact('contact_form');
    assert.equal(meta.length + google.length, 0);

    options.enabled = true;
    recordWhatsAppContact('contact_form');
    assert.deepEqual(meta, [['track', 'Contact', { contact_method: 'whatsapp', contact_source: 'contact_form', contact_action: 'form_handoff' }]]);
    assert.deepEqual(google, [['event', 'contact', { contact_method: 'whatsapp', contact_source: 'contact_form', contact_action: 'form_handoff' }]]);
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});

test('Enquiry text and outbound URL are discarded even if an event contains extra fields', () => {
  const calls = [];
  const privateText = 'Ayesha ayesha@example.test +923001234567 private project details';
  const event = new CustomEvent(WHATSAPP_CONTACT_EVENT, { detail: { source: 'contact_quick_chat', name: privateText, email: privateText, message: privateText, url: `https://wa.me/923114544040?text=${privateText}`, contact_action: privateText } });
  reportWhatsAppContact(event, { enabled: true, consent: 'yes', pathname: '/contact', meta: (...args) => calls.push(args), google: (...args) => calls.push(args) });
  assert.equal(calls.length, 2);
  assert.ok(!JSON.stringify(calls).includes(privateText));
  assert.deepEqual(calls[0][2], { contact_method: 'whatsapp', contact_source: 'contact_quick_chat', contact_action: 'chat_click' });
  assert.ok(calls.every((args) => !['Lead', 'generate_lead', 'conversion'].includes(args[1])));
});

test('Private routes and malformed contact events cannot reach analytics', () => {
  const calls = [];
  const sinks = { enabled: true, consent: 'yes', meta: (...args) => calls.push(args), google: (...args) => calls.push(args) };
  const valid = new CustomEvent(WHATSAPP_CONTACT_EVENT, { detail: { source: 'floating_button' } });
  for (const pathname of ['/portal', '/portal/legacy', '/admin', '/admin.html']) {
    reportWhatsAppContact(valid, { ...sinks, pathname });
  }
  for (const detail of [null, 'contact_form', {}, { source: 'ayesha@example.test' }, { source: { email: 'private@example.test' } }]) {
    reportWhatsAppContact(new CustomEvent(WHATSAPP_CONTACT_EVENT, { detail }), { ...sinks, pathname: '/' });
  }
  assert.equal(calls.length, 0);
});
