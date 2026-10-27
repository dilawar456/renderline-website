import test from 'node:test';
import assert from 'node:assert/strict';
import {cloudinaryLoader} from '../src/lib/cloudinary-loader.ts';
test('responsive CDN requests preserve the versioned original and replace a prior width',()=>{
 const url=new URL(cloudinaryLoader({src:'https://res.cloudinary.com/studio/image/upload/q_auto,f_auto,w_800,c_limit/v123/portfolio/house.jpg',width:384}));
 assert.equal(url.hostname,'res.cloudinary.com');
 assert.match(url.pathname,/\/v123\/portfolio\/house\.jpg$/);
 assert.match(url.pathname,/w_384/);
 assert.doesNotMatch(url.pathname,/w_800/);
 assert.match(url.pathname,/f_auto/);
});
test('untransformed PNGs receive bounded responsive delivery rather than the raw original',()=>{
 const url=cloudinaryLoader({src:'https://res.cloudinary.com/studio/image/upload/v123/plan.png',width:1200,quality:75});
 assert.match(url,/f_auto/);assert.match(url,/c_limit/);assert.match(url,/w_1200/);assert.match(url,/q_75/);assert.match(url,/v123\/plan\.png$/);
});
