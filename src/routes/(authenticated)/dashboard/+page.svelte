<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowRight,
		ChartNoAxesCombined,
		CircleCheckBig,
		Megaphone,
		Wallet
	} from '@lucide/svelte';
	import { localizeHref, getLocale } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/Card';

	let { data } = $props();

	const locale = $derived(getLocale());
	const numberFormatter = $derived(new Intl.NumberFormat(locale));
	const currencyFormatter = $derived(
		new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
	);
	const percentFormatter = $derived(
		new Intl.NumberFormat(locale, {
			style: 'percent',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})
	);
	const itemsHref = $derived(resolve(localizeHref('/dashboard/items') as '/dashboard/items'));
	const logoutAction = $derived(resolve(localizeHref('/logout') as '/logout'));
	const metrics = $derived([
		{
			label: m['dashboard.metrics.total'](),
			value: numberFormatter.format(data.summary.totalCount),
			icon: Megaphone
		},
		{
			label: m['dashboard.metrics.active'](),
			value: numberFormatter.format(data.summary.activeCount),
			icon: CircleCheckBig
		},
		{
			label: m['dashboard.metrics.budget'](),
			value: currencyFormatter.format(data.summary.totalBudget),
			icon: Wallet
		},
		{
			label: m['dashboard.metrics.ctr'](),
			value: percentFormatter.format(data.summary.aggregateCtr),
			icon: ChartNoAxesCombined
		}
	]);
</script>

<svelte:head>
	<title>{m['dashboard.metaTitle']()}</title>
	<meta name="description" content={m['dashboard.metaDescription']()} />
</svelte:head>

<main class="space-y-6 py-8 md:py-12" aria-labelledby="dashboard-title">
	<h1 id="dashboard-title" class="sr-only">{m['dashboard.title']()}</h1>

	<section
		class="flex flex-col gap-5 border-b border-border pb-6 md:pb-8 lg:flex-row lg:items-center lg:justify-between"
	>
		<div class="min-w-0 py-2">
			<p class="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
				{m['dashboard.welcome']({ name: data.user.name })}
			</p>
			<p class="mt-2 text-base text-muted-foreground">
				{m['dashboard.welcomeDescription']()}
			</p>
		</div>

		<Card class="w-full lg:w-auto lg:min-w-lg">
			<CardContent class="flex flex-col gap-4 sm:flex-row sm:items-center">
				<div class="flex min-w-0 flex-1 items-center gap-4">
					<Avatar name={data.user.name} />
					<div class="min-w-0">
						<div class="flex items-center gap-2">
							<CardTitle class="truncate text-lg">{data.user.name}</CardTitle>
							<Badge>{m[`role.${data.user.role}`]()}</Badge>
						</div>
						<p class="truncate text-sm text-muted-foreground">{data.user.email}</p>
					</div>
				</div>

				<form method="POST" action={logoutAction} class="sm:ml-auto">
					<Button type="submit" variant="ghost">
						{m['nav.logout']()}
					</Button>
				</form>
			</CardContent>
		</Card>
	</section>

	<section aria-labelledby="campaign-overview-title">
		<h2 id="campaign-overview-title" class="sr-only">{m['dashboard.metrics.title']()}</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{#each metrics as metric (metric.label)}
				<Card size="sm">
					<CardHeader class="flex items-center gap-3">
						<span class="rounded-md bg-brand/10 p-2 text-brand size-8">
							<metric.icon aria-hidden="true" class="size-4" />
						</span>
						<CardTitle class="text-sm text-muted-foreground">{metric.label}</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-2xl font-bold tracking-tight text-foreground">{metric.value}</p>
					</CardContent>
				</Card>
			{/each}
		</div>
	</section>

	<a
		href={itemsHref}
		class="group flex min-h-36 items-center justify-between gap-6 rounded-lg border border-brand/25 bg-brand px-6 py-7 text-brand-foreground shadow-sm transition hover:bg-brand/90 focus-visible:outline-brand md:px-8"
	>
		<span>
			<span class="block text-xl font-bold md:text-2xl">{m['dashboard.cta.title']()}</span>
			<span class="mt-1 block text-sm text-brand-foreground/80 md:text-base">
				{m['dashboard.cta.description']()}
			</span>
		</span>
		<span
			class="rounded-full bg-brand-foreground/15 p-3 transition-transform group-hover:translate-x-1"
		>
			<ArrowRight aria-hidden="true" class="size-6" />
		</span>
	</a>
</main>
