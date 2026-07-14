import { THEME_COOKIE_NAME, isThemeMode, type ThemeMode } from '$lib/contexts/Theme.svelte';
import { localizeHref } from '$lib/paraglide/runtime.js';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies, locals, setHeaders, url }) => {
	setHeaders({ 'Cache-Control': 'private, no-store' });

	if (!locals.user) {
		const loginUrl = new URL(localizeHref('/login'), url.origin);
		loginUrl.searchParams.set('returnTo', `${url.pathname}${url.search}`);
		if (locals.sessionStatus === 'expired') {
			loginUrl.searchParams.set('reason', 'expired');
		}
		redirect(303, `${loginUrl.pathname}${loginUrl.search}`);
	}

	const cookieTheme = cookies.get(THEME_COOKIE_NAME);
	const theme: ThemeMode = isThemeMode(cookieTheme) ? cookieTheme : 'light';

	return { user: locals.user, theme };
};
