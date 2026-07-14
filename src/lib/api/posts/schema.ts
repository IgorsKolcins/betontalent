import { z } from 'zod';
import { POSTS_PER_PAGE } from './query';

export const localeSchema = z.enum(['en', 'de']);

export const rawTagSchema = z.object({
	slug: z.string().min(1),
	label: z.record(localeSchema, z.string().min(1))
});

export const localizedTagSchema = z.object({
	slug: z.string().min(1),
	label: z.string().min(1)
});

export const postTranslationSchema = z.object({
	title: z.string().min(1),
	excerpt: z.string().min(1),
	body: z.string().min(1)
});

export const rawPostSchema = z.object({
	id: z.string().min(1),
	slug: z.string().min(1),
	translations: z.record(localeSchema, postTranslationSchema),
	tags: z.array(z.string().min(1)),
	author: z.object({
		id: z.string().min(1),
		name: z.string().min(1),
		avatarColor: z.string().regex(/^#[0-9a-f]{6}$/i)
	}),
	publishedAt: z.iso.datetime(),
	readingTimeMinutes: z.number().int().positive(),
	coverColor: z.string().regex(/^#[0-9a-f]{6}$/i)
});

export const localizedPostSchema = rawPostSchema.omit({ translations: true, tags: true }).extend({
	title: z.string().min(1),
	excerpt: z.string().min(1),
	body: z.string().min(1),
	tags: z.array(localizedTagSchema)
});

export const postsResponseSchema = z.object({
	posts: z.array(localizedPostSchema),
	tags: z.array(localizedTagSchema),
	pagination: z.object({
		page: z.number().int().positive(),
		perPage: z.number().int().positive().default(POSTS_PER_PAGE),
		total: z.number().int().nonnegative(),
		totalPages: z.number().int().positive(),
		start: z.number().int().nonnegative(),
		end: z.number().int().nonnegative()
	})
});

export type RawPost = z.infer<typeof rawPostSchema>;
export type RawTag = z.infer<typeof rawTagSchema>;
export type LocalizedTag = z.infer<typeof localizedTagSchema>;
export type LocalizedPost = z.infer<typeof localizedPostSchema>;
export type PostsResponse = z.infer<typeof postsResponseSchema>;
export type Locale = z.infer<typeof localeSchema>;
