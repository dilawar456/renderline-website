import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projectWhatsAppUrl } from '../src/lib/whatsapp.ts';
import { publicPhoneDisplay, publicWhatsAppNumber } from '../src/lib/public-contact.ts';

test('WhatsApp handoff uses the business number and preserves every enquiry field', () => {
  const enquiry = { name: ' Ayesha ', email: 'ayesha@example.test', phone: '+92 300 1234567', projectType: 'Interior Design', message: 'میز اور ceiling\nWood & brass + 30% details?' };
  const url = new URL(projectWhatsAppUrl('+92 311-4544040', enquiry));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/923114544040');
  const text = url.searchParams.get('text');
  assert.ok(text.includes('Name: Ayesha'));
  assert.ok(text.includes(`Email: ${enquiry.email}`));
  assert.ok(text.includes(`Phone: ${enquiry.phone}`));
  assert.ok(text.includes(`Service: ${enquiry.projectType}`));
  assert.ok(text.endsWith(enquiry.message));
  assert.equal([...url.searchParams.keys()].length, 1);
});

test('Optional enquiry fields can be omitted without empty labels', () => {
  const url = new URL(projectWhatsAppUrl('923114544040', { name: 'Ali', email: 'ali@example.test', phone: '', projectType: '', message: 'Exterior reference' }));
  const text = url.searchParams.get('text');
  assert.ok(!text.includes('Phone:'));
  assert.ok(!text.includes('Service:'));
  assert.ok(text.includes('Project details:\nExterior reference'));
});

test('Corrupted CMS phone content cannot create an invalid WhatsApp URL or overflow the footer', () => {
  const invalid = '{"all":[188,187,180,166,160]}';
  assert.equal(publicWhatsAppNumber(invalid), '923114544040');
  assert.equal(publicPhoneDisplay(invalid, '923114544040'), '+92 311 4544040');
  assert.equal(publicPhoneDisplay('---', '923114544040'), '+92 311 4544040');
  assert.equal(publicWhatsAppNumber('+44 7700 900123'), '447700900123');
  assert.equal(publicPhoneDisplay('+44 7700 900123', '447700900123'), '+44 7700 900123');
});
