<script lang="ts">
	import { locale, _ } from 'svelte-i18n';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/Card';
	import type { Locale, Post } from '$lib/api/posts/schema';

	let { post }: { post: Post } = $props();
	const activeLocale = $derived(($locale ?? 'en') as Locale);
	const translation = $derived(post.translations[activeLocale]);
	const dateFormatter = $derived(
		new Intl.DateTimeFormat(activeLocale, {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		})
	);
</script>

<Card class="pt-0">
	<div
		data-slot="post-cover"
		class="h-36 border-b border-border"
		style:background-color={post.coverColor}
		aria-label={$_('blog.coverLabel', { values: { title: translation.title } })}
		role="img"
	></div>
	<CardHeader>
		<div class="mb-2 flex flex-wrap gap-1.5">
			{#each post.tags as tag (tag)}
				<Badge variant="outline">{tag}</Badge>
			{/each}
		</div>
		<CardTitle class="mb-2">{translation.title}</CardTitle>
		<CardDescription>{translation.excerpt}</CardDescription>
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
			{$_('blog.readingTime', { values: { minutes: post.readingTimeMinutes } })}
		</span>
	</CardFooter>
</Card>
