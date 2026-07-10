import { json } from '@sveltejs/kit';
import { listPosts } from '$lib/server/posts';
import type { RequestHandler } from './$types';

export const config = {
	runtime: 'edge'
};

export const GET: RequestHandler = () => {
	return json(
		{
			posts: listPosts()
		},
		{
			headers: {
				'Cache-Control': 'public, max-age=60, s-maxage=300'
			}
		}
	);
};
