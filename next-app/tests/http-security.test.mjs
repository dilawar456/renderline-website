import test from 'node:test';
import assert from 'node:assert/strict';
import { readJsonObject, safeApiError, HttpError } from '../src/lib/http-security.ts';
const request = (body, headers = {}) => new Request('https://renderline.pk/api/test', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body });
test('bounded JSON accepts valid objects and rejects malformed, null, arrays and incorrect media types', async () => {
  assert.deepEqual(await readJsonObject(request('{"ok":true}')), { ok: true });
  for (const body of ['{', 'null', '[]', '42']) await assert.rejects(readJsonObject(request(body)), e => e.status === 400);
  await assert.rejects(readJsonObject(request('{}', { 'content-type': 'text/plain' })), e => e.status === 415);
});
test('actual bytes are limited even when the content length is missing or falsely small', async () => {
  for (const headers of [{}, { 'content-length': '1' }]) await assert.rejects(readJsonObject(request('{"text":"' + 'x'.repeat(100) + '"}', headers), 30), e => e.status === 413);
  await assert.rejects(readJsonObject(request('{}', { 'content-length': '100' }), 30), e => e.status === 413);
});
test('unexpected errors never expose database details and every error prevents caching', async () => {
  const result = safeApiError(new Error('postgres secret internal implementation'));
  assert.equal(result.status, 500);
  assert.equal(result.headers.get('cache-control'), 'no-store');
  assert.doesNotMatch(JSON.stringify(await result.json()), /postgres|secret/);
  const denied = safeApiError(new Error('403:Owner access required.'));
  assert.equal(denied.status, 403);
  assert.deepEqual(await denied.json(), { error: 'Owner access required.' });
  assert.equal(safeApiError(new HttpError(413, 'Request is too large.')).status, 413);
});
