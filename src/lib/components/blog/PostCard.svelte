<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/Card';
	import type { LocalizedPost } from '$lib/api/posts/schema';

	let { post }: { post: LocalizedPost } = $props();
	const activeLocale = $derived(getLocale());
	const dateFormatter = $derived(
		new Intl.DateTimeFormat(activeLocale, {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		})
	);
	const numberFormatter = $derived(new Intl.NumberFormat(activeLocale));
	const readingTimeMinutes = $derived(numberFormatter.format(post.readingTimeMinutes));
	const returnTo = $derived(`${page.url.pathname}${page.url.search}`);
	const postHref = $derived(
		`${localizeHref(`/blog/${post.slug}`)}?returnTo=${encodeURIComponent(returnTo)}`
	);
</script>

<a
	href={resolve(postHref as '/blog/[slug]')}
	class="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
	aria-label={m['blog.readMoreLabel']({ title: post.title })}
>
	<Card class="h-full pt-0 transition-colors group-hover:border-foreground/30">
		<div
			data-blog-cover={post.slug}
			data-slot="post-cover"
			class="h-36 rounded-t-lg border-b border-border"
			style:background-color={post.coverColor}
			aria-label={m['blog.coverLabel']({ title: post.title })}
			role="img"
		></div>
		<CardHeader>
			<div class="mb-2 flex flex-wrap gap-1.5">
				{#each post.tags as tag (tag)}
					<Badge variant="outline">{tag}</Badge>
				{/each}
			</div>
			<CardTitle class="mb-2">{post.title}</CardTitle>
			<CardDescription>{post.excerpt}</CardDescription>
		</CardHeader>
		<CardContent class="mt-auto">
			<div class="flex items-center gap-2">
				<span
					class="size-8 shrink-0 rounded-full border border-border"
					style:background-color={post.author.avatarColor}
					aria-hidden="true"
				></span>
				<p class="min-w-0 text-sm font-medium text-foreground">
					{post.author.name}
				</p>
			</div>
		</CardContent>
		<CardFooter class="justify-between text-xs font-medium text-muted-foreground">
			<time datetime={post.publishedAt}>
				{dateFormatter.format(new Date(post.publishedAt))}
			</time>
			<span>
				{m['blog.readingTime']({ minutes: readingTimeMinutes })}
			</span>
		</CardFooter>
	</Card>
</a>
