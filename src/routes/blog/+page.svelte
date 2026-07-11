<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import PaginationNav from '$lib/components/blog/PaginationNav.svelte';
	import PostCard from '$lib/components/blog/PostCard.svelte';
	import PostControls from '$lib/components/blog/PostControls.svelte';

	let { data } = $props();
	const postsPage = $derived(data.postsResult.ok ? data.postsResult.data : undefined);
	const posts = $derived(postsPage?.posts ?? []);
</script>

<svelte:head>
	<title>{m['blog.title']()} | {m['app.title']()}</title>
	<meta name="description" content={m['blog.description']()} />
	<link rel="canonical" href={data.seo.canonical} />
	{#each data.seo.alternates as alternate (alternate.hreflang)}
		<link rel="alternate" hreflang={alternate.hreflang} href={alternate.href} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={data.seo.xDefault} />
</svelte:head>

<main class="min-h-screen py-10 md:py-14">
	<section class="container space-y-8" aria-labelledby="blog-title">
		<div class="max-w-2xl space-y-3">
			<h1 id="blog-title" class="text-4xl leading-tight font-bold text-foreground md:text-5xl">
				{m['blog.title']()}
			</h1>
			<p class="text-base leading-7 text-muted-foreground">
				{m['blog.description']()}
			</p>
		</div>

		<PostControls action="blog" formData={data.formData} />

		{#if data.postsResult.ok}
			{#if posts.length > 0}
				<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{#each posts as post (post.id)}
						<PostCard {post} />
					{/each}
				</div>
				{#if postsPage}
					<PaginationNav
						action="blog"
						query={data.formData.data}
						pagination={postsPage.pagination}
					/>
				{/if}
			{:else}
				<p class="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
					{m['blog.empty']()}
				</p>
			{/if}
		{:else}
			<p class="rounded-lg border border-border bg-card p-6 text-sm text-destructive">
				{m['common.error']()}
			</p>
		{/if}
	</section>
</main>
