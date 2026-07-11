import { getPosts } from '$lib/api/posts';
import { postQueryFormSchema } from '$lib/api/posts/query';
import { getLocaleSeo } from '$lib/seo';
import { getLocale } from '$lib/paraglide/runtime.js';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const locale = getLocale();
	const formData = await superValidate(url, zod4(postQueryFormSchema));

	return {
		formData,
		seo: getLocaleSeo(url.origin, locale, '/blog'),
		postsResult: await getPosts(fetch, {
			...formData.data,
			q: '',
			tag: '',
			locale
		})
	};
};
