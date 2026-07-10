import { getPosts } from '$lib/api/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	return {
		postsResult: await getPosts(fetch)
	};
};
