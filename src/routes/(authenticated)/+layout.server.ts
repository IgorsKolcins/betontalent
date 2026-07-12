import { localizeHref } from '$lib/paraglide/runtime.js';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, url }) => {
	if (!locals.user) {
		const loginUrl = new URL(localizeHref('/login'), url.origin);
		loginUrl.searchParams.set('returnTo', `${url.pathname}${url.search}`);
		if (locals.sessionStatus === 'expired') {
			loginUrl.searchParams.set('reason', 'expired');
		}
		redirect(303, `${loginUrl.pathname}${loginUrl.search}`);
	}

	return { user: locals.user };
};
