import { baseLocale, locales, localizeHref, type Locale } from '$lib/paraglide/runtime.js';

export type AlternateLink = {
	hreflang: Locale;
	href: string;
};

export type LocaleSeo = {
	canonical: string;
	xDefault: string;
	alternates: AlternateLink[];
};

export function getLocaleSeo(origin: string, locale: Locale, path = '/'): LocaleSeo {
	return {
		canonical: absoluteUrl(origin, localizeHref(path, { locale })),
		xDefault: absoluteUrl(origin, localizeHref(path, { locale: baseLocale })),
		alternates: locales.map((hreflang) => ({
			hreflang,
			href: absoluteUrl(origin, localizeHref(path, { locale: hreflang }))
		}))
	};
}

export function absoluteUrl(origin: string, path: string) {
	return new URL(path, origin).href;
}
