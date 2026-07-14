import { describe, expect, it } from 'vitest';
import { decodePostQuery } from './query';

describe('post URL state codec', () => {
	it('preserves valid search state when another URL field is invalid', () => {
		const params = new URLSearchParams({
			q: '  talent  ',
			tag: 'performance',
			sort: 'not-a-sort',
			page: '2'
		});

		expect(decodePostQuery(params, 'search')).toEqual({
			q: 'talent',
			tag: 'performance',
			sort: 'publishedAt-desc',
			page: 2
		});
	});
});
