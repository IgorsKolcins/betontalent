import { getPosts } from '$lib/api/posts';
import { decodePostQuery } from '$lib/api/posts/query';
import { getLocaleSeo } from '$lib/seo';
import { getLocale } from '$lib/paraglide/runtime.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders, url }) => {
	const locale = getLocale();
	const query = decodePostQuery(url.searchParams, 'blog');
	const postsResult = await getPosts(fetch, {
		...query,
		locale
	});

	if (postsResult.ok) {
		setHeaders({
			'Cache-Control': 'public, max-age=120, s-maxage=86400'
		});
	}

	return {
		query,
		seo: getLocaleSeo(url.origin, locale, '/blog'),
		postsResult
	};
};
