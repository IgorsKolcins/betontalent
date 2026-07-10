import { THEME_COOKIE_NAME, isThemeMode, type ThemeMode } from '$lib/contexts/Theme.svelte';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	const cookieTheme = cookies.get(THEME_COOKIE_NAME);
	const theme: ThemeMode = isThemeMode(cookieTheme) ? cookieTheme : 'light';

	return {
		theme
	};
};
