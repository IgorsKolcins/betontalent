<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import {
		createPostQueryParams,
		type PostQueryForm,
		type PostSortOption
	} from '$lib/api/posts/query';
	import type { PostsResponse } from '$lib/api/posts/schema';
	import Pagination from '$lib/components/ui/Pagination.svelte';

	type PostRoute = 'blog' | 'search';

	let {
		action,
		query,
		pagination,
		includeSearch = false
	}: {
		action: PostRoute;
		query: PostQueryForm;
		pagination: PostsResponse['pagination'];
		includeSearch?: boolean;
	} = $props();

	function queryStringFor(page: number): string {
		const params = createPostQueryParams({
			q: includeSearch ? query.q : '',
			tag: includeSearch ? query.tag : '',
			sort: query.sort as PostSortOption,
			page
		});

		return params ? `?${params}` : '';
	}

	function navigateToPage(page: number) {
		const queryString = queryStringFor(page);

		void goto(resolve(localizeHref(`/${action}${queryString}`) as '/'), {
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
