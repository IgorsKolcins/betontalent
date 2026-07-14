import postsJson from '../../../mocks/posts.json';
import tagsJson from '../../../mocks/tags.json';
import {
	DEFAULT_POST_SORT,
	POSTS_PER_PAGE,
	type PostQuery,
	type PostSortOption
} from '$lib/api/posts/query';
import {
	rawPostSchema,
	rawTagSchema,
	type Locale,
	type LocalizedPost,
	type LocalizedTag,
	type RawPost,
	type PostsResponse
} from '$lib/api/posts/schema';

const posts = rawPostSchema.array().parse(postsJson);
const tags = rawTagSchema.array().parse(tagsJson);
const tagsBySlug = new Map(tags.map((tag) => [tag.slug, tag]));

for (const post of posts) {
	for (const tag of post.tags) {
		if (!tagsBySlug.has(tag)) {
			throw new Error(`Post ${post.id} references unknown tag "${tag}"`);
		}
	}
}

export function getPost(slug: string, locale: Locale = 'en'): LocalizedPost | undefined {
	const post = posts.find((candidate) => candidate.slug === slug);
	if (!post) return undefined;

	return localizePost(post, locale);
}

export function listPostTags(locale: Locale): LocalizedTag[] {
	return tags
		.map((tag) => ({ slug: tag.slug, label: tag.label[locale] }))
		.sort((first, second) => first.label.localeCompare(second.label, locale));
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
		posts: pagePosts.map((post) => localizePost(post, locale)),
		tags: listPostTags(locale),
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

function localizePost(post: RawPost, locale: Locale): LocalizedPost {
	const { translations, tags: postTags, ...shared } = post;

	return {
		...shared,
		...translations[locale],
		tags: postTags.map((slug) => {
			const tag = tagsBySlug.get(slug)!;
			return { slug, label: tag.label[locale] };
		})
	};
}

function matchesSearch(post: RawPost, q: string, locale: Locale): boolean {
	if (!q) return true;

	const translation = post.translations[locale];
	// Search intentionally stays on localized teaser text, matching what users can scan in results.
	const searchableText = `${translation.title} ${translation.excerpt}`.toLocaleLowerCase(locale);

	return searchableText.includes(q);
}

function comparePosts(
	first: RawPost,
	second: RawPost,
	sort: PostSortOption,
	locale: Locale
): number {
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
