<script lang="ts">
	import { _ } from 'svelte-i18n';
	import PaginationNav from '$lib/components/blog/PaginationNav.svelte';
	import PostCard from '$lib/components/blog/PostCard.svelte';
	import PostControls from '$lib/components/blog/PostControls.svelte';

	let { data } = $props();
	const postsPage = $derived(data.postsResult.ok ? data.postsResult.data : undefined);
	const posts = $derived(postsPage?.posts ?? []);
	const searchPath = '/search';
	const hasQuery = $derived(Boolean(data.formData.data.q));
</script>

<svelte:head>
	<title>{$_('search.title')} | {$_('app.title')}</title>
	<meta name="description" content={$_('search.description')} />
</svelte:head>

<main class="min-h-screen py-10 md:py-14">
	<section class="container space-y-8" aria-labelledby="search-title">
		<div class="max-w-2xl space-y-3">
			<h1 id="search-title" class="text-4xl leading-tight font-bold text-foreground md:text-5xl">
				{$_('search.title')}
			</h1>
			<p class="text-base leading-7 text-muted-foreground">
				{$_('search.description')}
			</p>
		</div>

		<PostControls
			action={searchPath}
			formData={data.formData}
			showSearch
			tags={postsPage?.tags ?? []}
		/>

		{#if data.postsResult.ok}
			{#if postsPage}
				<p class="text-sm font-medium text-muted-foreground">
					{#if hasQuery}
						{$_('search.results', {
							values: { count: postsPage.pagination.total, query: data.formData.data.q }
						})}
					{:else}
						{$_('search.resultsCount', { values: { count: postsPage.pagination.total } })}
					{/if}
				</p>
			{/if}

			{#if posts.length > 0}
				<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{#each posts as post (post.id)}
						<PostCard {post} />
					{/each}
				</div>
				{#if postsPage}
					<PaginationNav
						action={searchPath}
						query={data.formData.data}
						pagination={postsPage.pagination}
						includeSearch
					/>
				{/if}
			{:else}
				<p class="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
					{$_('search.noResults')}
				</p>
			{/if}
		{:else}
			<p class="rounded-lg border border-border bg-card p-6 text-sm text-destructive">
				{$_('common.error')}
			</p>
		{/if}
	</section>
</main>
