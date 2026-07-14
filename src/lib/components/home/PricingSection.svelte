<script lang="ts">
	import { resolve } from '$app/paths';
	import { Check } from '@lucide/svelte';
	import type { HomepageContent } from '$lib/homepage/schema';
	import Button from '$lib/components/ui/Button.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/Card';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
	import { cn } from '$lib/utils/cn';

	type Plan = HomepageContent['pricing']['plans'][number];
	type PlanFeature = Plan['features'][number];

	let { pricing }: { pricing: HomepageContent['pricing'] } = $props();

	const currencyFormatter = $derived(
		new Intl.NumberFormat(getLocale(), {
			style: 'currency',
			currency: pricing.currency,
			maximumFractionDigits: 0
		})
	);

	function featureLabel(feature: PlanFeature): string {
		return m[`home.pricing.feature.${feature}`]();
	}
</script>

<Container
	as="section"
	id="pricing"
	class="scroll-mt-20 py-16 md:py-24"
	aria-labelledby="pricing-title"
>
	<div class="mx-auto max-w-2xl text-center">
		<p class="text-sm font-semibold tracking-wide text-brand uppercase">
			{m['home.pricing.eyebrow']()}
		</p>
		<h2 id="pricing-title" class="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
			{m['home.pricing.title']()}
		</h2>
		<p class="mt-4 text-base leading-7 text-muted-foreground">
			{m['home.pricing.description']()}
		</p>
	</div>

	<div class="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-3 lg:items-stretch">
		{#each pricing.plans as plan (plan.id)}
			<div class="relative">
				{#if plan.highlighted}
					<div
						class="z-10 absolute top-0 right-4 -translate-y-1/2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground"
					>
						{m['home.pricing.recommended']()}
					</div>
				{/if}
				<Card
					class={cn('relative h-full', {
						'border-brand shadow-lg shadow-brand/10 ring-1 ring-brand': plan.highlighted
					})}
				>
					<CardHeader class="pt-7">
						<CardTitle class="text-xl">{m[`home.pricing.plan.${plan.id}.name`]()}</CardTitle>
						<p class="min-h-10 text-sm leading-5 text-muted-foreground">
							{m[`home.pricing.plan.${plan.id}.description`]()}
						</p>
						<p class="mt-4 flex items-baseline gap-1">
							<span class="text-4xl font-bold tracking-tight">
								{plan.monthlyPrice === null
									? m['home.pricing.custom']()
									: currencyFormatter.format(plan.monthlyPrice)}
							</span>
							{#if plan.monthlyPrice !== null}
								<span class="text-sm text-muted-foreground">{m['home.pricing.perMonth']()}</span>
							{/if}
						</p>
					</CardHeader>
					<CardContent class="flex-1">
						<ul class="space-y-3">
							{#each plan.features as feature (feature)}
								<li class="flex gap-3 text-sm leading-5">
									<Check aria-hidden="true" class="mt-0.5 size-4 shrink-0 text-success" />
									<span>{featureLabel(feature)}</span>
								</li>
							{/each}
						</ul>
					</CardContent>
					<CardFooter class="border-0 bg-transparent pt-1">
						<Button
							href={resolve(localizeHref('/login') as '/login')}
							variant={plan.highlighted ? 'default' : 'secondary'}
							class="h-10 w-full"
						>
							{m[`home.pricing.plan.${plan.id}.cta`]()}
						</Button>
					</CardFooter>
				</Card>
			</div>
		{/each}
	</div>
</Container>
