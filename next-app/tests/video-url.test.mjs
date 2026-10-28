import test from 'node:test';
import assert from 'node:assert/strict';
import { videoSource } from '../src/lib/video-url.ts';
test('video URLs reject executable schemes, credentials and malformed CMS values', () => {
 for (const value of ['javascript:alert(1)', 'data:text/html,x', 'http://example.com/a', 'https://user:secret@example.com/video', null, 'not a URL']) assert.equal(videoSource(value), null);
});
test('embeds use only exact approved hosts and a complete 11-character video identifier', () => {
 assert.equal(videoSource('https://youtu.be/abcdefghijk?t=2').youtubeId, 'abcdefghijk');
 assert.equal(videoSource('https://www.youtube.com/watch?v=abcdefghijk').youtubeId, 'abcdefghijk');
 assert.equal(videoSource('https://youtube.com.evil.example/watch?v=abcdefghijk').youtubeId, null);
 assert.equal(videoSource('https://youtube.com/watch?v=abc%22%20onload=alert(1)').youtubeId, null);
 assert.equal(videoSource('https://example.com/film.mp4').url, 'https://example.com/film.mp4');
});
