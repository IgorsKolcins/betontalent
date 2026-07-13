<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import PostControls from '$lib/components/blog/PostControls.svelte';
	import PostResults from '$lib/components/blog/PostResults.svelte';
	import Container from '$lib/components/ui/Container.svelte';

	let { data } = $props();
	const postsPage = $derived(data.postsResult.ok ? data.postsResult.data : undefined);
</script>

<svelte:head>
	<title>{m['search.title']()} | {m['app.title']()}</title>
	<meta name="description" content={m['search.description']()} />
	<link rel="canonical" href={data.seo.canonical} />
	{#each data.seo.alternates as alternate (alternate.hreflang)}
		<link rel="alternate" hreflang={alternate.hreflang} href={alternate.href} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={data.seo.xDefault} />
</svelte:head>

<main class="min-h-screen py-10 md:py-14">
	<Container as="section" class="space-y-8" aria-labelledby="search-title">
		<div class="max-w-2xl space-y-3">
			<h1 id="search-title" class="text-4xl leading-tight font-bold text-foreground md:text-5xl">
				{m['search.title']()}
			</h1>
			<p class="text-base leading-7 text-muted-foreground">
				{m['search.description']()}
			</p>
		</div>

		<PostControls
			mode="search"
			formData={data.formData}
			tags={postsPage?.tags ?? []}
			totalCount={postsPage?.pagination.total ?? 0}
		/>

		<PostResults mode="search" query={data.formData.data} result={data.postsResult} />
	</Container>
</main>
