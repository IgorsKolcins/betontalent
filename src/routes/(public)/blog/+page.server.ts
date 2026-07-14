import { getPosts } from '$lib/api/posts';
import { decodePostQuery } from '$lib/api/posts/query';
import { getLocaleSeo } from '$lib/seo';
import { getLocale } from '$lib/paraglide/runtime.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const locale = getLocale();
	const query = decodePostQuery(url.searchParams, 'blog');

	return {
		query,
		seo: getLocaleSeo(url.origin, locale, '/blog'),
		postsResult: await getPosts(fetch, {
			...query,
			locale
		})
	};
};
