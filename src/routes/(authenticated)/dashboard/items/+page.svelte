<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { navigating } from '$app/state';
	import { deLocalizeHref, localizeHref } from '$lib/paraglide/runtime.js';
	import type { PageData } from './$types';
	import {
		createCampaignQueryParams,
		splitCampaignSort,
		type CampaignSort,
		type CampaignSortDirection,
		type CampaignSortField
	} from '$lib/campaigns/query';
	import CampaignControls from '$lib/components/dashboard/CampaignControls.svelte';
	import CampaignPagination from '$lib/components/dashboard/CampaignPagination.svelte';
	import CampaignStatusEditor from '$lib/components/dashboard/CampaignStatusEditor.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import DelayedLoading from '$lib/components/ui/DelayedLoading.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import {
		Table,
		TableBody,
		TableCaption,
		TableCell,
		TableHeader,
		TableRow,
		TableSortableHead
	} from '$lib/components/ui/Table';

	let { data }: { data: PageData } = $props();
	let isRetrying = $state(false);

	const locale = $derived(getLocale());
	const currencyFormatter = $derived(
		new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' })
	);
	const percentFormatter = $derived(
		new Intl.NumberFormat(locale, {
			style: 'percent',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})
	);
	const dateFormatter = $derived(
		new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' })
	);
	const statusBadgeVariants = {
		draft: 'draft',
		scheduled: 'scheduled',
		active: 'active',
		paused: 'paused',
		completed: 'completed',
		archived: 'archived'
	} as const;
	const defaultSortDirections: Record<CampaignSortField, CampaignSortDirection> = {
		name: 'asc',
		status: 'asc',
		channel: 'asc',
		owner: 'asc',
		budget: 'desc',
		spent: 'desc',
		ctr: 'desc',
		updatedAt: 'desc'
	};
	const query = $derived(data.query);
	const activeSort = $derived(splitCampaignSort(query.sort));
	const hasFilters = $derived(Boolean(query.q || query.status || query.channel));
	const isItemsNavigation = $derived(
		Boolean(navigating?.to && deLocalizeHref(navigating.to.url.pathname) === '/dashboard/items')
	);

	function nextSort(field: CampaignSortField): CampaignSort {
		const direction =
			activeSort.field === field
				? activeSort.direction === 'asc'
					? 'desc'
					: 'asc'
				: defaultSortDirections[field];

		return `${field}-${direction}`;
	}

	function sortHref(field: CampaignSortField): string {
		const params = createCampaignQueryParams({ ...query, sort: nextSort(field), page: 1 });
		const path = params ? `/dashboard/items?${params}` : '/dashboard/items';

		return localizeHref(path);
	}

	function sortLabel(field: CampaignSortField, label: string): string {
		const direction = nextSort(field).endsWith('-asc') ? 'ascending' : 'descending';

		return m['dashboard.items.sort']({
			column: label,
			direction: m[`dashboard.items.sort.${direction}`]()
		});
	}

	function sortDirection(field: CampaignSortField): 'ascending' | 'descending' | 'none' {
		if (activeSort.field !== field) return 'none';

		return activeSort.direction === 'asc' ? 'ascending' : 'descending';
	}

	function handleSort(field: CampaignSortField): void {
		void goto(resolve(sortHref(field) as '/dashboard/items'));
	}

	async function retryCampaigns(): Promise<void> {
		isRetrying = true;
		try {
			await invalidateAll();
		} finally {
			isRetrying = false;
		}
	}
</script>

{#snippet campaignTableHeader()}
	<TableHeader>
		<TableRow class="hover:bg-transparent">
			<TableSortableHead
				class="min-w-64"
				onclick={() => handleSort('name')}
				label={m['dashboard.items.column.name']()}
				sortDirection={sortDirection('name')}
				sortLabel={sortLabel('name', m['dashboard.items.column.name']())}
			/>
			<TableSortableHead
				onclick={() => handleSort('status')}
				label={m['dashboard.items.column.status']()}
				sortDirection={sortDirection('status')}
				sortLabel={sortLabel('status', m['dashboard.items.column.status']())}
			/>
			<TableSortableHead
				onclick={() => handleSort('channel')}
				label={m['dashboard.items.column.channel']()}
				sortDirection={sortDirection('channel')}
				sortLabel={sortLabel('channel', m['dashboard.items.column.channel']())}
			/>
			<TableSortableHead
				onclick={() => handleSort('owner')}
				label={m['dashboard.items.column.owner']()}
				sortDirection={sortDirection('owner')}
				sortLabel={sortLabel('owner', m['dashboard.items.column.owner']())}
			/>
			<TableSortableHead
				class="text-right"
				onclick={() => handleSort('budget')}
				label={m['dashboard.items.column.budget']()}
				sortDirection={sortDirection('budget')}
				sortLabel={sortLabel('budget', m['dashboard.items.column.budget']())}
			/>
			<TableSortableHead
				class="text-right"
				onclick={() => handleSort('spent')}
				label={m['dashboard.items.column.spent']()}
				sortDirection={sortDirection('spent')}
				sortLabel={sortLabel('spent', m['dashboard.items.column.spent']())}
			/>
			<TableSortableHead
				class="text-right"
				onclick={() => handleSort('ctr')}
				label={m['dashboard.items.column.ctr']()}
				sortDirection={sortDirection('ctr')}
				sortLabel={sortLabel('ctr', m['dashboard.items.column.ctr']())}
			/>
			<TableSortableHead
				onclick={() => handleSort('updatedAt')}
				label={m['dashboard.items.column.updated']()}
				sortDirection={sortDirection('updatedAt')}
				sortLabel={sortLabel('updatedAt', m['dashboard.items.column.updated']())}
			/>
		</TableRow>
	</TableHeader>
{/snippet}

<svelte:head>
	<title>{m['dashboard.items.metaTitle']()}</title>
	<meta name="description" content={m['dashboard.items.metaDescription']()} />
</svelte:head>

<main class="min-w-0 space-y-6 py-8 md:py-12" aria-labelledby="items-title">
	<header>
		<h1 id="items-title">{m['dashboard.items.title']()}</h1>
		<p class="mt-2 text-sm text-muted-foreground">
			{#await data.campaignsPage}
				<DelayedLoading>{m['common.loading']()}</DelayedLoading>
			{:then campaignsPage}
				{#if hasFilters}
					{m['dashboard.items.filteredCount']({
						count: campaignsPage.pagination.total,
						total: campaignsPage.pagination.totalCount
					})}
				{:else}
					{m['dashboard.items.count']({ count: campaignsPage.pagination.totalCount })}
				{/if}
			{:catch}
				{m['dashboard.items.error']()}
			{/await}
		</p>
	</header>

	<CampaignControls formData={data.formData} />

	{#await data.campaignsPage}
		<Table
			scrollAreaLabel={m['dashboard.items.tableLabel']()}
			loading
			loadingLabel={m['dashboard.items.loading']()}
		>
			<TableCaption class="sr-only">{m['dashboard.items.tableCaption']()}</TableCaption>
			{@render campaignTableHeader()}
			<TableBody>
				{#each [1, 2, 3, 4, 5] as row (row)}
					<TableRow class="hover:bg-transparent">
						<TableCell class="h-14">
							<div class="h-3 w-full animate-pulse rounded-full bg-muted"></div>
						</TableCell>
						<TableCell class="h-14">
							<div class="h-3 w-full animate-pulse rounded-full bg-muted"></div>
						</TableCell>
						<TableCell class="h-14">
							<div class="h-3 w-full animate-pulse rounded-full bg-muted"></div>
						</TableCell>
						<TableCell class="h-14">
							<div class="h-3 w-full animate-pulse rounded-full bg-muted"></div>
						</TableCell>
						<TableCell class="h-14">
							<div class="h-3 w-full animate-pulse rounded-full bg-muted"></div>
						</TableCell>
						<TableCell class="h-14">
							<div class="h-3 w-full animate-pulse rounded-full bg-muted"></div>
						</TableCell>
						<TableCell class="h-14">
							<div class="h-3 w-full animate-pulse rounded-full bg-muted"></div>
						</TableCell>
						<TableCell class="h-14">
							<div class="h-3 w-full animate-pulse rounded-full bg-muted"></div>
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	{:then campaignsPage}
		<Table
			scrollAreaLabel={m['dashboard.items.tableLabel']()}
			loading={isItemsNavigation}
			loadingLabel={m['dashboard.items.loading']()}
		>
			<TableCaption class="sr-only">{m['dashboard.items.tableCaption']()}</TableCaption>
			{@render campaignTableHeader()}
			<TableBody>
				{#each campaignsPage.campaigns as campaign (campaign.id)}
					<TableRow>
						<TableCell class="font-medium text-foreground">{campaign.name}</TableCell>
						<TableCell>
							{#if data.user.role === 'admin' || data.user.role === 'editor'}
								<CampaignStatusEditor
									campaignId={campaign.id}
									campaignName={campaign.name}
									status={campaign.status}
								/>
							{:else}
								<Badge variant={statusBadgeVariants[campaign.status]}>
									{m[`campaign.status.${campaign.status}`]()}
								</Badge>
							{/if}
						</TableCell>
						<TableCell>{m[`campaign.channel.${campaign.channel}`]()}</TableCell>
						<TableCell>
							<span class="flex items-center gap-2">
								<Avatar name={campaign.owner.name} size="sm" />
								<span>{campaign.owner.name}</span>
							</span>
						</TableCell>
						<TableCell class="text-right tabular-nums">
							{currencyFormatter.format(campaign.budget)}
						</TableCell>
						<TableCell class="text-right tabular-nums">
							{currencyFormatter.format(campaign.spent)}
						</TableCell>
						<TableCell class="text-right tabular-nums">
							{percentFormatter.format(campaign.ctr)}
						</TableCell>
						<TableCell>{dateFormatter.format(new Date(campaign.updatedAt))}</TableCell>
					</TableRow>
				{:else}
					<TableRow class="hover:bg-transparent">
						<TableCell colspan={8} class="h-28 text-center text-muted-foreground">
							{hasFilters ? m['dashboard.items.noResults']() : m['dashboard.items.empty']()}
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>

		<CampaignPagination {query} pagination={campaignsPage.pagination} />
	{:catch}
		<Table scrollAreaLabel={m['dashboard.items.tableLabel']()}>
			<TableCaption class="sr-only">{m['dashboard.items.tableCaption']()}</TableCaption>
			{@render campaignTableHeader()}
			<TableBody>
				<TableRow class="hover:bg-transparent">
					<TableCell colspan={8} class="h-36 text-center">
						<div class="flex flex-col items-center gap-3 text-destructive" role="alert">
							<p>{m['dashboard.items.error']()}</p>
							<Button variant="secondary" onclick={retryCampaigns} disabled={isRetrying}>
								{#if isRetrying}<DelayedLoading><LoadingSpinner /></DelayedLoading>{/if}
								{m['common.retry']()}
							</Button>
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	{/await}
</main>
