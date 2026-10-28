import assert from 'node:assert/strict';
import http from 'node:http';
const base = process.argv[2] || 'http://127.0.0.1:3111';
const routes = ['/', '/about', '/contact', '/pricing', '/services', '/drawing-samples', '/start-project', '/process', '/portfolio', '/portfolio/186', '/services/house-plans', '/services/front-elevation', '/services/interior-design', '/services/drawing-booklets', '/services/exterior-visualization', '/services/3d-modeling', '/services/walkthrough-animation'];
const results = [];
async function check(name, run) { try { await run(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: error.message }); } }
for (const route of routes) await check('Public page and SEO: ' + route, async () => {
 const response = await fetch(base + route);
 assert.equal(response.status, 200);
 const html = await response.text();
 assert.equal((html.match(/<h1\b/g) || []).length, 1);
 assert.ok(html.includes('rel="canonical" href="https://renderline.pk' + (route === '/' ? '' : route) + '"'));
 assert.ok(html.includes('property="og:url" content="https://renderline.pk' + (route === '/' ? '' : route) + '"'));
 assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
 assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
 assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
 assert.ok(response.headers.get('content-security-policy')?.includes("object-src 'none'"));
 assert.equal(response.headers.get('x-powered-by'), null);
});
for (const [route, method] of [['/api/studio/website','GET'], ['/api/studio/website','PATCH'], ['/api/studio/people','POST'], ['/api/studio/organize','POST'], ['/api/revalidate','POST'], ['/api/studio/capabilities','POST']]) await check('Unauthenticated access rejected: '+method+' '+route, async () => {
 const response = await fetch(base + route, {method, ...(method === 'GET' ? {} : {headers:{'content-type':'application/json'},body:'{}'})});
 assert.equal(response.status, 401);
 assert.ok(response.headers.get('cache-control')?.includes('no-store'));
 assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
});
await check('Private pages excluded from indexing', async () => { for (const route of ['/portal','/portal/website','/admin.html']) { const r=await fetch(base+route); assert.equal(r.status,200); assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow'); } });
await check('Permanent domain redirect preserves route and query', async () => {
 const response = await new Promise((resolve, reject) => { const request=http.get(base+'/pricing?source=review',{headers:{Host:'dilawarali.com'}},r=>{r.resume();resolve({status:r.statusCode,location:r.headers.location});});request.on('error',reject); });
 assert.equal(response.status,308); assert.equal(response.location,'https://renderline.pk/pricing?source=review');
});
await check('Structured service data is parseable and identifies the studio', async () => { const html=await fetch(base+'/services/front-elevation').then(r=>r.text()); const blocks=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1])); assert.ok(blocks.some(b=>b['@graph']?.some(x=>x['@type']==='Service' && x.provider['@id']==='https://renderline.pk/#studio'))); });
await check('Portfolio sitemap contains public pages and excludes private destinations', async () => { const xml=await fetch(base+'/sitemap.xml').then(r=>r.text()); assert.ok(xml.includes('https://renderline.pk/portfolio/186')); assert.ok(!xml.includes('/portal')&&!xml.includes('/admin')); });
await check('Social preview is a generated PNG', async () => { const r=await fetch(base+'/opengraph-image'); assert.equal(r.status,200); assert.ok(r.headers.get('content-type')?.startsWith('image/png')); const bytes=new Uint8Array(await r.arrayBuffer()); assert.deepEqual([...bytes.slice(0,4)],[137,80,78,71]); });
console.log(JSON.stringify({base,checks:results.length,allPassed:results.every(r=>r.passed),results},null,2));
if(results.some(r=>!r.passed))process.exitCode=1;
