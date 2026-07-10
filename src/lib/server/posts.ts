import postsJson from '../../../mocks/posts.json';
import {
	DEFAULT_POST_SORT,
	POSTS_PER_PAGE,
	type PostQuery,
	type PostSortOption
} from '$lib/api/posts/query';
import {
	postsResponseSchema,
	type Locale,
	type Post,
	type PostsResponse
} from '$lib/api/posts/schema';

const parsedPosts = postsResponseSchema.parse({
	posts: postsJson,
	tags: [],
	pagination: {
		page: 1,
		perPage: POSTS_PER_PAGE,
		total: postsJson.length,
		totalPages: Math.max(1, Math.ceil(postsJson.length / POSTS_PER_PAGE)),
		start: postsJson.length > 0 ? 1 : 0,
		end: Math.min(postsJson.length, POSTS_PER_PAGE)
	}
});

const posts = parsedPosts.posts;

export function listPostTags(): string[] {
	return [...new Set(posts.flatMap((post) => post.tags))].sort((first, second) =>
		first.localeCompare(second)
	);
}

export function listPosts(query: Partial<PostQuery> = {}): PostsResponse {
	const locale = query.locale ?? 'en';
	const q = query.q?.trim().toLocaleLowerCase(locale) ?? '';
	const tag = query.tag?.trim() ?? '';
	const sort = query.sort ?? DEFAULT_POST_SORT;
	// Clamp user-provided URL state before deriving offsets so invalid pages never leak into slicing.
	const page = Math.max(1, query.page ?? 1);

	const filteredPosts = posts
		.filter((post) => matchesSearch(post, q, locale))
		.filter((post) => (tag ? post.tags.includes(tag) : true))
		.sort((first, second) => comparePosts(first, second, sort, locale));

	const total = filteredPosts.length;
	const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
	const safePage = Math.min(page, totalPages);
	const startIndex = (safePage - 1) * POSTS_PER_PAGE;
	const pagePosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

	return {
		posts: pagePosts,
		tags: listPostTags(),
		pagination: {
			page: safePage,
			perPage: POSTS_PER_PAGE,
			total,
			totalPages,
			start: total === 0 ? 0 : startIndex + 1,
			end: startIndex + pagePosts.length
		}
	};
}

function matchesSearch(post: Post, q: string, locale: Locale): boolean {
	if (!q) return true;

	const translation = post.translations[locale];
	// Search intentionally stays on localized teaser text, matching what users can scan in results.
	const searchableText = `${translation.title} ${translation.excerpt}`.toLocaleLowerCase(locale);

	return searchableText.includes(q);
}

function comparePosts(first: Post, second: Post, sort: PostSortOption, locale: Locale): number {
	// Sort options are encoded as field-direction tokens so URL state maps directly to one comparator.
	const [field, direction] = sort.split('-') as [
		'title' | 'publishedAt' | 'readingTimeMinutes',
		'asc' | 'desc'
	];
	const multiplier = direction === 'asc' ? 1 : -1;

	if (field === 'title') {
		return (
			first.translations[locale].title.localeCompare(second.translations[locale].title, locale) *
			multiplier
		);
	}

	if (field === 'publishedAt') {
		return (
			(new Date(first.publishedAt).getTime() - new Date(second.publishedAt).getTime()) * multiplier
		);
	}

	return (first.readingTimeMinutes - second.readingTimeMinutes) * multiplier;
}
