import { apiFetch, type ApiFetch, type ApiResult } from '$lib/api/client';
import { postsResponseSchema, type PostsResponse } from './schema';

export async function getPosts(fetcher: ApiFetch): Promise<ApiResult<PostsResponse>> {
	const result = await apiFetch<unknown>(fetcher, '/api/posts', {
		errorUserMessage: 'Could not load blog posts'
	});

	if (!result.ok) {
		return result;
	}

	const parsed = postsResponseSchema.safeParse(result.data);

	if (!parsed.success) {
		console.error('Blog posts API contract mismatch', {
			error: parsed.error.flatten()
		});

		return {
			ok: false,
			status: 502,
			error: 'Could not load blog posts'
		};
	}

	return {
		ok: true,
		data: parsed.data
	};
}
