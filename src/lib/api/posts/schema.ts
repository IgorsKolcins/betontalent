import { z } from 'zod';

const localeSchema = z.enum(['en', 'de']);

export const postTranslationSchema = z.object({
	title: z.string().min(1),
	excerpt: z.string().min(1),
	body: z.string().min(1)
});

export const postSchema = z.object({
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

export const postsResponseSchema = z.object({
	posts: z.array(postSchema)
});

export type Post = z.infer<typeof postSchema>;
export type PostsResponse = z.infer<typeof postsResponseSchema>;
