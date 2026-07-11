import { THEME_COOKIE_NAME, isThemeMode } from '$lib/contexts/Theme.svelte';
import { getTextDirection } from '$lib/paraglide/runtime.js';
import { paraglideMiddleware } from '$lib/paraglide/server.js';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const cookieTheme = event.cookies.get(THEME_COOKIE_NAME);
	const theme = isThemeMode(cookieTheme) ? cookieTheme : 'light';

	return paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => {
				const classAttribute = theme === 'dark' ? ' class="dark"' : '';
				return html
					.replace('%lang%', locale)
					.replace('%dir%', getTextDirection(locale))
					.replace('<html', `<html${classAttribute}`);
			}
		});
	});
};
