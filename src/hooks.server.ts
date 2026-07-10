import { THEME_COOKIE_NAME, isThemeMode } from '$lib/contexts/Theme.svelte';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const cookieTheme = event.cookies.get(THEME_COOKIE_NAME);
	const theme = isThemeMode(cookieTheme) ? cookieTheme : 'light';

	return resolve(event, {
		transformPageChunk: ({ html }) =>
			theme === 'dark' ? html.replace('<html lang="en">', '<html lang="en" class="dark">') : html
	});
};
