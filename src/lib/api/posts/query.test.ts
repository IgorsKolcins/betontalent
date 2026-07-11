import { describe, expect, it } from 'vitest';
import { createPostRouteQueryParams, postQueryFormSchema, queryForPostRoute } from './query';

const searchQuery = postQueryFormSchema.parse({
	q: 'edge',
	tag: 'engineering',
	sort: 'title-asc',
	page: 3
});

describe('post route query policy', () => {
	it('retains all URL-backed search state', () => {
		expect(queryForPostRoute('search', searchQuery)).toEqual(searchQuery);
	});

	it('removes search-only state from the blog route', () => {
		expect(queryForPostRoute('blog', searchQuery)).toEqual({
			q: '',
			tag: '',
			sort: 'title-asc',
			page: 3
		});
	});

	it('retains search filters while changing pages', () => {
		expect(createPostRouteQueryParams('search', searchQuery, 2)).toBe(
			'q=edge&tag=engineering&sort=title-asc&page=2'
		);
	});

	it('resets to the first page without serializing the default page', () => {
		expect(createPostRouteQueryParams('search', searchQuery, 1)).toBe(
			'q=edge&tag=engineering&sort=title-asc'
		);
	});

	it('rejects invalid URL state at the shared schema boundary', () => {
		expect(postQueryFormSchema.safeParse({ sort: 'unknown', page: 0 }).success).toBe(false);
	});
});
