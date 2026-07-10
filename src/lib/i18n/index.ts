import { addMessages, init, locale } from 'svelte-i18n';
import de from './messages/de.json';
import en from './messages/en.json';

export const LOCALE_COOKIE_NAME = 'locale';
export const SUPPORTED_LOCALES = ['en', 'de'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

let isInitialized = false;

export function isLocale(value: string | null | undefined): value is Locale {
	return SUPPORTED_LOCALES.includes(value as Locale);
}

export function setupI18n(initialLocale: Locale) {
	if (!isInitialized) {
		addMessages('en', en);
		addMessages('de', de);
		init({
			fallbackLocale: 'en',
			initialLocale
		});
		isInitialized = true;
		return;
	}

	locale.set(initialLocale);
}

export function persistLocale(nextLocale: Locale) {
	document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
	document.documentElement.lang = nextLocale;
}

export function getNextLocale(currentLocale: Locale): Locale {
	return currentLocale === 'en' ? 'de' : 'en';
}

export function toggleLocale(currentLocale: Locale): Locale {
	const nextLocale = getNextLocale(currentLocale);
	locale.set(nextLocale);
	persistLocale(nextLocale);

	return nextLocale;
}
