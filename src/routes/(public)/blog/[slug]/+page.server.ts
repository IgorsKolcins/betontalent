import { error } from '@sveltejs/kit';
import { deLocalizeHref, getLocale, localizeHref } from '$lib/paraglide/runtime.js';
import { getLocaleSeo } from '$lib/seo';
import { getPost } from '$lib/server/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, setHeaders, url }) => {
	const locale = getLocale();
	const post = getPost(params.slug, locale);

	if (!post) error(404, 'Post not found');

	setHeaders({
		'Cache-Control': 'public, max-age=120, s-maxage=86400'
	});

	return {
		post,
		backHref: getBackHref(url),
		seo: getLocaleSeo(url.origin, locale, `/blog/${post.slug}`)
	};
};

function getBackHref(url: URL): string {
	const fallback = localizeHref('/blog');
	const returnTo = url.searchParams.get('returnTo');
	if (!returnTo) return fallback;

	try {
		const candidate = new URL(returnTo, url.origin);
		const route = deLocalizeHref(candidate.pathname);

		if (candidate.origin !== url.origin || (route !== '/blog' && route !== '/search')) {
			return fallback;
		}

		return `${candidate.pathname}${candidate.search}`;
	} catch {
		return fallback;
	}
}
