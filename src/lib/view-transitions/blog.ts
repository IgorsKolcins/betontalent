export type BlogTransitionDirection = 'forward' | 'backward';
export type BlogTransition = {
	direction: BlogTransitionDirection;
	slug: string;
};

const BLOG_ROUTES = new Set(['/blog', '/search']);
const BLOG_POST_ROUTE = /^\/blog\/([^/]+)\/?$/;

export function getBlogTransition(fromUrl: URL | null, toUrl: URL | null): BlogTransition | null {
	const from = normalizePathname(fromUrl?.pathname ?? null);
	const to = normalizePathname(toUrl?.pathname ?? null);
	const fromPostSlug = getPostSlug(from);
	const toPostSlug = getPostSlug(to);

	if (from && BLOG_ROUTES.has(from) && toPostSlug) {
		return { direction: 'forward', slug: toPostSlug };
	}

	if (
		fromPostSlug &&
		fromUrl &&
		toUrl &&
		to &&
		BLOG_ROUTES.has(to) &&
		isReturnTarget(fromUrl, toUrl)
	) {
		return { direction: 'backward', slug: fromPostSlug };
	}

	return null;
}

function normalizePathname(pathname: string | null): string | null {
	return pathname?.replace(/^\/(?:en|de)(?=\/|$)/, '') || null;
}

function getPostSlug(pathname: string | null): string | null {
	return pathname?.match(BLOG_POST_ROUTE)?.[1] ?? null;
}

function isReturnTarget(fromUrl: URL, toUrl: URL): boolean {
	const returnTo = fromUrl.searchParams.get('returnTo');
	if (!returnTo) return false;

	try {
		const candidate = new URL(returnTo, fromUrl.origin);
		return (
			candidate.origin === toUrl.origin &&
			candidate.pathname === toUrl.pathname &&
			candidate.search === toUrl.search
		);
	} catch {
		return false;
	}
}
