import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch, type ApiFetch } from './client';

describe('apiFetch', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('calls the configured API path and returns parsed JSON for successful responses', async () => {
		const fetcher = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ posts: [] }), {
				status: 200
			})
		) satisfies ApiFetch;

		const result = await apiFetch(fetcher, '/api/posts');

		expect(fetcher).toHaveBeenCalledWith('/api/posts', {
			method: undefined,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: undefined
		});
		expect(result).toEqual({
			ok: true,
			data: { posts: [] }
		});
	});

	it('serializes request bodies for mutating requests', async () => {
		const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));

		await apiFetch(fetcher, '/api/posts', {
			method: 'POST',
			body: { title: 'API post' }
		});

		expect(fetcher).toHaveBeenCalledWith(
			'/api/posts',
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({ title: 'API post' })
			})
		);
	});

	it('returns a user-facing error when the API responds with a failed status', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const fetcher = vi.fn().mockResolvedValue(new Response('Nope', { status: 500 }));

		const result = await apiFetch(fetcher, '/api/posts', {
			errorUserMessage: 'Could not reach posts service'
		});

		expect(result).toEqual({
			ok: false,
			status: 500,
			error: 'Could not reach posts service'
		});
	});

	it('returns a service-unavailable result when the fetcher throws', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const fetcher = vi.fn().mockRejectedValue(new Error('socket closed'));

		const result = await apiFetch(fetcher, '/api/posts');

		expect(result).toEqual({
			ok: false,
			status: 503,
			error: 'API service unavailable'
		});
	});
});
