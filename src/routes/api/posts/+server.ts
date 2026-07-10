import { json } from '@sveltejs/kit';
import { postQueryFormSchema } from '$lib/api/posts/query';
import { localeSchema } from '$lib/api/posts/schema';
import { listPosts } from '$lib/server/posts';
import type { RequestHandler } from './$types';

export const config = {
	runtime: 'edge'
};

export const GET: RequestHandler = ({ url }) => {
	const formQuery = postQueryFormSchema.safeParse(Object.fromEntries(url.searchParams));
	const locale = localeSchema.safeParse(url.searchParams.get('locale'));

	return json(
		listPosts({
			...(formQuery.success ? formQuery.data : {}),
			locale: locale.success ? locale.data : 'en'
		}),
		{
			headers: {
				'Cache-Control': 'public, max-age=60, s-maxage=300'
			}
		}
	);
};
