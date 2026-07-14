import { describe, expect, it } from 'vitest';
import { getBlogTransition } from './blog';

describe('Blog Post view transition policy', () => {
	it.each([
		['/en/blog', '/en/blog/a-post'],
		['/de/search', '/de/blog/ein-beitrag'],
		['/search', '/blog/a-post']
	])('covers forward from %s into a Blog Post', (from, to) => {
		expect(getBlogTransition(url(from), url(to))).toEqual({
			direction: 'forward',
			slug: to.split('/').filter(Boolean).at(-1)
		});
	});

	it.each([
		['/en/blog/a-post', '/en/blog'],
		['/de/blog/ein-beitrag', '/de/search'],
		['/blog/a-post', '/search']
	])('covers backward from a Blog Post to %s', (from, to) => {
		expect(getBlogTransition(url(`${from}?returnTo=${encodeURIComponent(to)}`), url(to))).toEqual({
			direction: 'backward',
			slug: from.split('/').filter(Boolean).at(-1)
		});
	});

	it.each([
		['/en/blog', '/en/search'],
		['/en/blog/first-post', '/en/blog/second-post'],
		[null, '/en/blog/a-post'],
		['/en/search', null],
		['/en/blog/an-older-post', '/en/blog'],
		['/en/blog/a-post?returnTo=%2Fen%2Fsearch%3Fq%3Dpost', '/en/blog']
	])('does not cover unrelated navigation from %s to %s', (from, to) => {
		expect(getBlogTransition(url(from), url(to))).toBeNull();
	});
});

function url(path: string | null): URL | null {
	return path ? new URL(path, 'https://example.com') : null;
}
