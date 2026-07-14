import { describe, expect, it } from 'vitest';
import { getPost, listPosts } from './posts';

describe('post taxonomy', () => {
	it('localizes labels while preserving stable tag slugs', () => {
		const result = listPosts({ locale: 'de', tag: 'engineering' });
		const engineering = result.tags.find((tag) => tag.slug === 'engineering');

		expect(result.tags).toHaveLength(8);
		expect(engineering).toEqual({ slug: 'engineering', label: 'Entwicklung' });
		expect(result.posts.length).toBeGreaterThan(0);
		expect(result.posts.every((post) => post.tags.some((tag) => tag.slug === 'engineering'))).toBe(
			true
		);
	});

	it('uses taxonomy labels on an individual localized post', () => {
		const sourcePost = listPosts({ locale: 'de' }).posts[0];
		const post = getPost(sourcePost.slug, 'de');

		expect(post?.tags).toEqual(sourcePost.tags);
		expect(post?.tags.every((tag) => tag.slug.length > 0 && tag.label.length > 0)).toBe(true);
	});
});
