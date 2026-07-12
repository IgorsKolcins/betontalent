const DASHBOARD_PATH = /^\/(?:en\/|de\/)?dashboard(?:\/|$)/;

// Login accepts a return target from the URL. Restricting it to localized dashboard
// paths prevents external/open redirects and keeps public routes out of the auth flow.
export function safeDashboardReturnTo(value: string | null): string | null {
	if (!value || !value.startsWith('/') || value.startsWith('//')) return null;

	const url = new URL(value, 'https://local.invalid');
	return DASHBOARD_PATH.test(url.pathname) ? `${url.pathname}${url.search}${url.hash}` : null;
}
