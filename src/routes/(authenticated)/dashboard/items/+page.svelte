<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import {
		Table,
		TableBody,
		TableCaption,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/Table';

	let { data }: { data: PageData } = $props();

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
</script>

<svelte:head>
	<title>{m['dashboard.items.metaTitle']()}</title>
	<meta name="description" content={m['dashboard.items.metaDescription']()} />
</svelte:head>

<main class="min-w-0 space-y-6 py-8 md:py-12" aria-labelledby="items-title">
	<header>
		<h1 id="items-title">{m['dashboard.items.title']()}</h1>
		<p class="mt-2 text-sm text-muted-foreground">
			{m['dashboard.items.count']({ count: data.campaigns.length })}
		</p>
	</header>

	<Table scrollAreaLabel={m['dashboard.items.tableLabel']()}>
		<TableCaption class="sr-only">{m['dashboard.items.tableCaption']()}</TableCaption>
		<TableHeader>
			<TableRow class="hover:bg-transparent">
				<TableHead class="min-w-64">{m['dashboard.items.column.name']()}</TableHead>
				<TableHead>{m['dashboard.items.column.status']()}</TableHead>
				<TableHead>{m['dashboard.items.column.channel']()}</TableHead>
				<TableHead>{m['dashboard.items.column.owner']()}</TableHead>
				<TableHead class="text-right">{m['dashboard.items.column.budget']()}</TableHead>
				<TableHead class="text-right">{m['dashboard.items.column.spent']()}</TableHead>
				<TableHead class="text-right">{m['dashboard.items.column.ctr']()}</TableHead>
				<TableHead>{m['dashboard.items.column.updated']()}</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.campaigns as campaign (campaign.id)}
				<TableRow>
					<TableCell class="font-medium text-foreground">{campaign.name}</TableCell>
					<TableCell>
						<Badge variant={statusBadgeVariants[campaign.status]}>
							{m[`campaign.status.${campaign.status}`]()}
						</Badge>
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
			{/each}
		</TableBody>
	</Table>
</main>
