<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import type { ApiResult } from '$lib/api/client';
	import type { PostQueryForm, PostRouteMode } from '$lib/api/posts/query';
	import type { PostsResponse } from '$lib/api/posts/schema';
	import PaginationNav from './PaginationNav.svelte';
	import PostCard from './PostCard.svelte';

	let {
		mode,
		query,
		result
	}: {
		mode: PostRouteMode;
		query: PostQueryForm;
		result: ApiResult<PostsResponse>;
	} = $props();

	const page = $derived(result.ok ? result.data : undefined);
</script>

{#if result.ok && page}
	{#if page.posts.length > 0}
		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each page.posts as post (post.id)}
				<PostCard {post} />
			{/each}
		</div>
		<PaginationNav {mode} {query} pagination={page.pagination} />
	{:else}
		<p class="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
			{mode === 'search' ? m['search.noResults']() : m['blog.empty']()}
		</p>
	{/if}
{:else}
	<p class="rounded-lg border border-border bg-card p-6 text-sm text-destructive">
		{m['common.error']()}
	</p>
{/if}
