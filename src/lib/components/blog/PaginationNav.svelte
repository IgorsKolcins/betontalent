<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		createPostQueryParams,
		type PostQueryForm,
		type PostSortOption
	} from '$lib/api/posts/query';
	import type { PostsResponse } from '$lib/api/posts/schema';
	import Pagination from '$lib/components/ui/Pagination.svelte';

	type ActionPath = '/blog' | '/search';
	type QueryHref = ActionPath | `${ActionPath}?${string}`;

	let {
		action,
		query,
		pagination,
		includeSearch = false
	}: {
		action: ActionPath;
		query: PostQueryForm;
		pagination: PostsResponse['pagination'];
		includeSearch?: boolean;
	} = $props();

	function hrefFor(page: number): QueryHref {
		const params = createPostQueryParams({
			q: includeSearch ? query.q : '',
			tag: includeSearch ? query.tag : '',
			sort: query.sort as PostSortOption,
			page
		});

		return params ? `${action}?${params}` : action;
	}

	function navigateToPage(page: number) {
		void goto(resolve(hrefFor(page)), {
			keepFocus: true,
			noScroll: false
		});
	}
</script>

{#if pagination.totalPages > 1}
	<Pagination
		count={pagination.total}
		perPage={pagination.perPage}
		page={pagination.page}
		onPageChange={navigateToPage}
	/>
{/if}
