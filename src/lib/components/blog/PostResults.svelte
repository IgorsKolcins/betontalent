<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { m } from '$lib/paraglide/messages.js';
	import type { ApiResult } from '$lib/api/client';
	import type { PostQueryForm, PostRouteMode } from '$lib/api/posts/query';
	import type { PostsResponse } from '$lib/api/posts/schema';
	import PaginationNav from './PaginationNav.svelte';
	import PostCard from './PostCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import DelayedLoading from '$lib/components/ui/DelayedLoading.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';

	let {
		mode,
		query,
		result
	}: {
		mode: PostRouteMode;
		query: PostQueryForm;
		result: ApiResult<PostsResponse>;
	} = $props();
	let isRetrying = $state(false);

	const page = $derived(result.ok ? result.data : undefined);
	const emptyGridCells = $derived(
		page && mode === 'blog'
			? Array.from(
					{ length: Math.max(0, page.pagination.perPage - page.posts.length) },
					(_, index) => index
				)
			: []
	);

	async function retry(): Promise<void> {
		isRetrying = true;
		try {
			await invalidateAll();
		} finally {
			isRetrying = false;
		}
	}
</script>

{#if result.ok && page}
	{#if page.posts.length > 0}
		<div
			data-post-grid
			class={mode === 'blog'
				? 'grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3'
				: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'}
		>
			{#each page.posts as post (post.id)}
				{#if mode === 'blog'}
					<div data-post-grid-cell class="h-[27rem]"><PostCard {post} /></div>
				{:else}
					<PostCard {post} />
				{/if}
			{/each}
			{#each emptyGridCells as index (index)}
				<div data-post-grid-cell aria-hidden="true" class="h-[27rem]"></div>
			{/each}
		</div>
		<PaginationNav {mode} {query} pagination={page.pagination} />
	{:else}
		<p class="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
			{mode === 'search' ? m['search.noResults']() : m['blog.empty']()}
		</p>
	{/if}
{:else}
	<div
		class="flex flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive"
		role="alert"
	>
		<p>{m['common.error']()}</p>
		<Button variant="secondary" onclick={retry} disabled={isRetrying}>
			{#if isRetrying}<DelayedLoading><LoadingSpinner /></DelayedLoading>{/if}
			{m['common.retry']()}
		</Button>
	</div>
{/if}
