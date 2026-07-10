import postsJson from '../../../mocks/posts.json';
import { postsResponseSchema, type Post } from '$lib/api/posts/schema';

const parsedPosts = postsResponseSchema.parse({
	posts: postsJson
});

export function listPosts(): Post[] {
	return parsedPosts.posts;
}
