import { test } from 'node:test';
import assert from 'node:assert/strict';
import { portalDestination } from '../src/lib/portal-link.ts';

test('local preview opens the supplied workspace while a live website never sends visitors to localhost', () => {
  assert.deepEqual(portalDestination('127.0.0.1:3100', undefined, 'development'), { url: 'http://127.0.0.1:4173/', local: true });
  assert.equal(portalDestination('renderline.example', undefined, 'development'), null);
  assert.equal(portalDestination('localhost:3100', undefined, 'production'), null);
  assert.equal(portalDestination('renderline.example', 'http://127.0.0.1:4173/', 'production'), null);
  assert.deepEqual(portalDestination('renderline.example', 'https://studio.renderline.example/', 'production'), { url: 'https://studio.renderline.example/', local: false });
});

test('studio configuration rejects credentials, unsafe URLs and a redirect back to itself', () => {
  for (const value of ['javascript:alert(1)', 'http://studio.example/', 'https://user:password@studio.example/', 'https://studio.example/?token=secret', 'https://studio.example/#token', 'https://renderline.example/portal']) {
    assert.equal(portalDestination('renderline.example', value, 'production'), null);
  }
});
