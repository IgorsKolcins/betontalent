import { baseLocale, locales, localizeHref, type Locale } from '$lib/paraglide/runtime.js';
import { absoluteUrl } from '$lib/seo';
import type { RequestHandler } from './$types';

const SITEMAP_PATHS = ['/', '/blog', '/search'] as const;

export const GET: RequestHandler = ({ url }) => {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${SITEMAP_PATHS.flatMap((path) =>
	locales.map((locale) => renderUrlEntry(url.origin, locale, path))
).join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Cache-Control': 'public, max-age=300, s-maxage=3600',
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
};

function renderUrlEntry(origin: string, locale: Locale, path: (typeof SITEMAP_PATHS)[number]) {
	const localizedUrl = absoluteUrl(origin, localizeHref(path, { locale }));
	const alternates = locales
		.map(
			(alternateLocale) =>
				`    <xhtml:link rel="alternate" hreflang="${alternateLocale}" href="${escapeXml(
					absoluteUrl(origin, localizeHref(path, { locale: alternateLocale }))
				)}" />`
		)
		.join('\n');
	const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
		absoluteUrl(origin, localizeHref(path, { locale: baseLocale }))
	)}" />`;

	return `  <url>
    <loc>${escapeXml(localizedUrl)}</loc>
${alternates}
${xDefault}
  </url>`;
}

function escapeXml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;');
}
