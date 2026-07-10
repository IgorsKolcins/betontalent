<script lang="ts">
	import { _, locale } from 'svelte-i18n';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/Card';

	let { data } = $props();
	const activeLocale = $derived(($locale ?? 'en') as 'en' | 'de');
	const posts = $derived(data.postsResult.ok ? data.postsResult.data.posts : []);
	const dateFormatter = $derived(
		new Intl.DateTimeFormat(activeLocale, {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		})
	);
</script>

<svelte:head>
	<title>{$_('blog.title')} | {$_('app.title')}</title>
	<meta name="description" content={$_('blog.description')} />
</svelte:head>

<main class="min-h-screen py-10 md:py-14">
	<section class="container space-y-8" aria-labelledby="blog-title">
		<div class="max-w-2xl space-y-3">
			<h1 id="blog-title" class="text-4xl leading-tight font-bold text-foreground md:text-5xl">
				{$_('blog.title')}
			</h1>
			<p class="text-base leading-7 text-muted-foreground">
				{$_('blog.description')}
			</p>
		</div>

		{#if data.postsResult.ok}
			{#if posts.length > 0}
				<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{#each posts as post (post.id)}
						{@const translation = post.translations[activeLocale]}
						<Card class="pt-0">
							<div
								data-slot="post-cover"
								class="h-36 border-b border-border"
								style:background-color={post.coverColor}
								aria-label={$_('blog.coverLabel', { values: { title: translation.title } })}
								role="img"
							></div>
							<CardHeader>
								<div class="flex flex-wrap gap-1.5 mb-2">
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
					{/each}
				</div>
			{:else}
				<p class="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
					{$_('blog.empty')}
				</p>
			{/if}
		{:else}
			<p class="rounded-lg border border-border bg-card p-6 text-sm text-destructive">
				{$_('common.error')}
			</p>
		{/if}
	</section>
</main>
