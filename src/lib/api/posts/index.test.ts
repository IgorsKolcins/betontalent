import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPosts } from './index';

const jsonResponse = (body: unknown, init?: ResponseInit) =>
	new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init
	});

describe('blog posts API helper', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns posts when the API response matches the contract', async () => {
		const fetcher = vi.fn().mockResolvedValue(
			jsonResponse({
				posts: [
					{
						id: 'post_1',
						slug: 'edge-api',
						title: 'Edge API',
						excerpt: 'Fast content delivery.',
						body: 'Fast content delivery.',
						tags: ['engineering'],
						author: {
							id: 'u_1',
							name: 'Anna Becker',
							avatarColor: '#f59e0b'
						},
						publishedAt: '2026-05-28T00:00:00Z',
						readingTimeMinutes: 3,
						coverColor: '#0ea5e9'
					}
				],
				tags: ['engineering'],
				pagination: {
					page: 1,
					perPage: 6,
					total: 1,
					totalPages: 1,
					start: 1,
					end: 1
				}
			})
		);

		const result = await getPosts(fetcher);

		expect(fetcher).toHaveBeenCalledWith('/api/posts', expect.any(Object));
		expect(result).toEqual({
			ok: true,
			data: {
				posts: [
					expect.objectContaining({
						id: 'post_1',
						slug: 'edge-api'
					})
				],
				tags: ['engineering'],
				pagination: {
					page: 1,
					perPage: 6,
					total: 1,
					totalPages: 1,
					start: 1,
					end: 1
				}
			}
		});
	});

	it('returns a contract error when the API response shape drifts', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const fetcher = vi.fn().mockResolvedValue(jsonResponse({ posts: [{ id: 'post_1' }] }));

		const result = await getPosts(fetcher);

		expect(result).toEqual({
			ok: false,
			status: 502,
			error: 'Could not load blog posts'
		});
	});
});
