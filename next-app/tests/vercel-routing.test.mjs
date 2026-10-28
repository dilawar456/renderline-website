import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { pathToRegexp } = require('next/dist/compiled/path-to-regexp');
const root = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
const app = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
test('every Vercel header source compiles without unsupported nested capture groups', () => {
 for (const config of [root, app]) for (const rule of config.headers) assert.doesNotThrow(() => pathToRegexp(rule.source));
 assert.ok(pathToRegexp(root.headers.find(r=>r.source.startsWith('/assets/')&&r.source.includes('png')).source).test('/assets/logo.png'));
});
test('unversioned public scripts revalidate while hashed Next assets remain immutable', () => {
 const cache = path => root.headers.filter(r=>pathToRegexp(r.source).test(path)).flatMap(r=>r.headers).filter(h=>h.key.toLowerCase()==='cache-control').at(-1)?.value;
 assert.equal(cache('/supabase-client.js'), 'public, max-age=0, must-revalidate');
 assert.equal(cache('/styles.css'), 'public, max-age=0, must-revalidate');
 assert.equal(cache('/_next/static/chunks/hashed.js'), 'public, max-age=31536000, immutable');
});
