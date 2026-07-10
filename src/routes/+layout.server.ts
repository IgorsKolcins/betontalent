import { THEME_COOKIE_NAME, isThemeMode, type ThemeMode } from '$lib/contexts/Theme.svelte';
import { LOCALE_COOKIE_NAME, isLocale, type Locale } from '$lib/i18n';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	const cookieTheme = cookies.get(THEME_COOKIE_NAME);
	const theme: ThemeMode = isThemeMode(cookieTheme) ? cookieTheme : 'light';
	const cookieLocale = cookies.get(LOCALE_COOKIE_NAME);
	const locale: Locale = isLocale(cookieLocale) ? cookieLocale : 'en';

	return {
		locale,
		theme
	};
};
