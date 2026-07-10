import { THEME_COOKIE_NAME, isThemeMode } from '$lib/contexts/Theme.svelte';
import { LOCALE_COOKIE_NAME, isLocale } from '$lib/i18n';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const cookieTheme = event.cookies.get(THEME_COOKIE_NAME);
	const theme = isThemeMode(cookieTheme) ? cookieTheme : 'light';
	const cookieLocale = event.cookies.get(LOCALE_COOKIE_NAME);
	const locale = isLocale(cookieLocale) ? cookieLocale : 'en';

	return resolve(event, {
		transformPageChunk: ({ html }) => {
			const classAttribute = theme === 'dark' ? ' class="dark"' : '';
			return html.replace('<html lang="en">', `<html lang="${locale}"${classAttribute}>`);
		}
	});
};
