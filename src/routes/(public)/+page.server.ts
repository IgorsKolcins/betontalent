import { env } from '$env/dynamic/public';
import { getLocaleSeo } from '$lib/seo';
import { getLocale } from '$lib/paraglide/runtime.js';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = ({ url }) => {
	const siteOrigin = env.PUBLIC_SITE_URL ? new URL(env.PUBLIC_SITE_URL).origin : url.origin;

	return {
		seo: getLocaleSeo(siteOrigin, getLocale())
	};
};
