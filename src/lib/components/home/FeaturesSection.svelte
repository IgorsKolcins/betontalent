<script lang="ts">
	import { BarChart3, SearchCheck, SlidersHorizontal, Workflow } from '@lucide/svelte';
	import type { HomepageContent } from '$lib/api/homepage/schema';
	import Container from '$lib/components/ui/Container.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/Card';
	import { m } from '$lib/paraglide/messages.js';

	type FeatureId = HomepageContent['features'][number];

	let { features }: { features: HomepageContent['features'] } = $props();

	function title(id: FeatureId): string {
		return m[`home.features.${id}.title`]();
	}

	function description(id: FeatureId): string {
		return m[`home.features.${id}.description`]();
	}
</script>

<Container
	as="section"
	id="features"
	class="scroll-mt-20 py-16 md:py-24"
	aria-labelledby="features-title"
>
	<div class="mx-auto max-w-2xl text-center">
		<p class="text-sm font-semibold tracking-wide text-brand uppercase">
			{m['home.features.eyebrow']()}
		</p>
		<h2 id="features-title" class="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
			{m['home.features.title']()}
		</h2>
		<p class="mt-4 text-base leading-7 text-muted-foreground">
			{m['home.features.description']()}
		</p>
	</div>

	<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each features as feature (feature)}
			<Card
				class="h-full transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none"
			>
				<CardHeader>
					<div
						class="mb-3 flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand"
					>
						{#if feature === 'talent'}
							<SearchCheck aria-hidden="true" class="size-5" />
						{:else if feature === 'campaigns'}
							<Workflow aria-hidden="true" class="size-5" />
						{:else if feature === 'insights'}
							<BarChart3 aria-hidden="true" class="size-5" />
						{:else}
							<SlidersHorizontal aria-hidden="true" class="size-5" />
						{/if}
					</div>
					<CardTitle>{title(feature)}</CardTitle>
				</CardHeader>
				<CardContent class="leading-6 text-muted-foreground">
					{description(feature)}
				</CardContent>
			</Card>
		{/each}
	</div>
</Container>
