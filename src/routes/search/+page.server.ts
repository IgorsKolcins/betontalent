import { getPosts } from '$lib/api/posts';
import { postQueryFormSchema } from '$lib/api/posts/query';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, parent, url }) => {
	const { locale } = await parent();
	const formData = await superValidate(url, zod4(postQueryFormSchema));

	return {
		formData,
		postsResult: await getPosts(fetch, {
			...formData.data,
			locale
		})
	};
};
