import { z } from 'zod';

export const POST_SORT_OPTIONS = [
	'publishedAt-desc',
	'publishedAt-asc',
	'title-asc',
	'title-desc',
	'readingTimeMinutes-asc',
	'readingTimeMinutes-desc'
] as const;

export const DEFAULT_POST_SORT = 'publishedAt-desc';
export const POSTS_PER_PAGE = 6;
export const MAX_POST_QUERY_LENGTH = 120;

export const postQueryFormSchema = z.object({
	q: z.string().trim().max(MAX_POST_QUERY_LENGTH).default(''),
	tag: z.string().trim().max(80).default(''),
	sort: z.enum(POST_SORT_OPTIONS).default(DEFAULT_POST_SORT),
	page: z.coerce.number().int().min(1).default(1)
});

export type PostQueryForm = z.infer<typeof postQueryFormSchema>;
export type PostSortOption = (typeof POST_SORT_OPTIONS)[number];

export type PostQuery = PostQueryForm & {
	// Locale is server-owned context, not a visible form field, but search/sort must use it.
	locale: 'en' | 'de';
};

export function createPostQueryParams(query: Partial<PostQueryForm>): string {
	const params = new URLSearchParams();

	if (query.q) params.set('q', query.q);
	if (query.tag) params.set('tag', query.tag);
	if (query.sort && query.sort !== DEFAULT_POST_SORT) params.set('sort', query.sort);
	if (query.page && query.page > 1) params.set('page', String(query.page));

	return params.toString();
}

export function createApiPostQueryParams(query: Partial<PostQuery>): string {
	const params = new URLSearchParams(createPostQueryParams(query));

	if (query.locale) {
		params.set('locale', query.locale);
	}

	return params.toString();
}
