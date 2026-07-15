<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { createCampaignQueryParams, type CampaignQuery } from '$lib/api/campaigns/query';
	import Pagination from '$lib/components/ui/Pagination.svelte';

	let {
		query,
		pagination
	}: {
		query: CampaignQuery;
		pagination: { page: number; perPage: number; total: number; totalPages: number };
	} = $props();

	function navigateToPage(page: number) {
		const params = createCampaignQueryParams(query, page);
		const path = params ? `/dashboard/items?${params}` : '/dashboard/items';

		void goto(resolve(localizeHref(path) as '/dashboard/items'), {
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
