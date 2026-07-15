import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import type { ApiResult } from '$lib/api/client';
import type { PostQueryForm } from '$lib/api/posts/query';
import type { LocalizedPost, PostsResponse } from '$lib/api/posts/schema';
import PostResults from './PostResults.svelte';
import '../../../routes/layout.css';

const query: PostQueryForm = {
	q: 'performance',
	tag: '',
	sort: 'publishedAt-desc',
	page: 1
};

const post: LocalizedPost = {
	id: 'post_1',
	slug: 'fast-content',
	title: 'Fast content',
	excerpt: 'A practical guide to shipping a fast content experience.',
	body: 'Post body',
	tags: [{ slug: 'performance', label: 'Performance' }],
	author: { id: 'author_1', name: 'Anna Becker', avatarColor: '#f59e0b' },
	publishedAt: '2026-05-28T00:00:00Z',
	readingTimeMinutes: 4,
	coverColor: '#0ea5e9'
};

function successfulResult(posts: LocalizedPost[]): ApiResult<PostsResponse> {
	return {
		ok: true,
		data: {
			posts,
			tags: [{ slug: 'performance', label: 'Performance' }],
			pagination: {
				page: 1,
				perPage: 6,
				total: posts.length ? 7 : 0,
				totalPages: posts.length ? 2 : 1,
				start: posts.length ? 1 : 0,
				end: posts.length
			}
		}
	};
}

describe('PostResults', () => {
	it('composes post details into a linked result card', async () => {
		render(PostResults, { mode: 'search', query, result: successfulResult([post]) });

		await expect
			.element(page.getByRole('heading', { name: post.title, exact: true }))
			.toBeInTheDocument();
		await expect.element(page.getByText(post.excerpt)).toBeInTheDocument();
		await expect
			.element(page.getByRole('link', { name: `Read ${post.title}` }))
			.toHaveAttribute('href', expect.stringContaining('/blog/fast-content'));
	});

	it('renders pagination for result sets spanning multiple pages', async () => {
		render(PostResults, {
			mode: 'search',
			query,
			result: successfulResult([post])
		});

		await expect.element(page.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Next page' })).toBeEnabled();
	});

	it('keeps the result grid height stable when the last page is not full', () => {
		const posts = Array.from({ length: 6 }, (_, index) => ({
			...post,
			id: `post_${index + 1}`,
			slug: `fast-content-${index + 1}`
		}));
		const fullPage = render(PostResults, {
			mode: 'blog',
			query,
			result: successfulResult(posts)
		});
		const lastPage = render(PostResults, {
			mode: 'blog',
			query: { ...query, page: 2 },
			result: successfulResult(posts.slice(0, 2))
		});

		const fullGrid = fullPage.container.querySelector('[data-post-grid]');
		const lastGrid = lastPage.container.querySelector('[data-post-grid]');
		expect(fullGrid).not.toBeNull();
		expect(lastGrid).not.toBeNull();
		expect(lastGrid!.getBoundingClientRect().height).toBe(fullGrid!.getBoundingClientRect().height);
	});

	it('distinguishes an empty search from a service failure', async () => {
		render(PostResults, { mode: 'search', query, result: successfulResult([]) });
		await expect.element(page.getByText('No matches. Try a different query.')).toBeInTheDocument();

		render(PostResults, {
			mode: 'search',
			query,
			result: { ok: false, status: 503, error: 'Posts unavailable' }
		});
		await expect.element(page.getByRole('alert')).toHaveTextContent('Something went wrong.');
		await expect.element(page.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
	});
});
