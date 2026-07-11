import { getLocaleSeo } from '$lib/seo';
import { getLocale } from '$lib/paraglide/runtime.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	return {
		seo: getLocaleSeo(url.origin, getLocale())
	};
};
