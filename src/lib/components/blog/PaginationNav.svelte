<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import {
		createPostRouteQueryParams,
		type PostQueryForm,
		type PostRouteMode
	} from '$lib/api/posts/query';
	import type { PostsResponse } from '$lib/api/posts/schema';
	import Pagination from '$lib/components/ui/Pagination.svelte';

	let {
		mode,
		query,
		pagination
	}: {
		mode: PostRouteMode;
		query: PostQueryForm;
		pagination: PostsResponse['pagination'];
	} = $props();

	function queryStringFor(page: number): string {
		const params = createPostRouteQueryParams(mode, query, page);

		return params ? `?${params}` : '';
	}

	function navigateToPage(page: number) {
		const queryString = queryStringFor(page);

		void goto(resolve(localizeHref(`/${mode}${queryString}`) as '/'), {
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
