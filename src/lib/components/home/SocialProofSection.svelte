<script lang="ts">
	import { Quote, Star } from '@lucide/svelte';
	import type { HomepageContent } from '$lib/api/homepage/schema';
	import Container from '$lib/components/ui/Container.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	type Stat = HomepageContent['socialProof']['stats'][number];

	let { socialProof }: { socialProof: HomepageContent['socialProof'] } = $props();

	const numberFormatter = new Intl.NumberFormat(getLocale());
	const stars = [1, 2, 3, 4, 5] as const;

	function statValue(stat: Stat): string {
		return m[`home.socialProof.stat.${stat.id}.value`]({
			value: numberFormatter.format(stat.value)
		});
	}
</script>

<section
	class="border-y border-border bg-muted/45 py-16 md:py-24"
	aria-labelledby="social-proof-title"
>
	<Container>
		<div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
			<div>
				<p class="text-sm font-semibold tracking-wide text-brand uppercase">
					{m['home.socialProof.eyebrow']()}
				</p>
				<h2 id="social-proof-title" class="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
					{m['home.socialProof.title']()}
				</h2>
				<div class="mt-8 grid grid-cols-3 gap-3">
					{#each socialProof.stats as stat (stat.id)}
						<div class="rounded-lg border border-border bg-background p-4 shadow-sm">
							<p class="text-2xl font-bold tracking-tight md:text-3xl">{statValue(stat)}</p>
							<p class="mt-1 text-xs leading-5 text-muted-foreground md:text-sm">
								{m[`home.socialProof.stat.${stat.id}.label`]()}
							</p>
						</div>
					{/each}
				</div>
			</div>

			<figure
				class="relative overflow-hidden rounded-xl border border-border bg-card p-7 shadow-sm md:p-10"
			>
				<Quote aria-hidden="true" class="absolute top-6 right-6 size-16 text-brand/10" />
				<div
					class="flex gap-1 text-warning"
					aria-label={m['home.socialProof.rating']({ rating: socialProof.testimonial.rating })}
				>
					{#each stars.slice(0, socialProof.testimonial.rating) as star (star)}
						<Star aria-hidden="true" class="size-4 fill-current" />
					{/each}
				</div>
				<blockquote class="mt-6 text-xl leading-8 font-semibold tracking-tight md:text-2xl">
					“{m[`home.socialProof.testimonial.${socialProof.testimonial.id}.quote`]()}”
				</blockquote>
				<figcaption class="mt-7 flex items-center gap-3">
					<div
						class="flex size-11 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground"
					>
						{m[`home.socialProof.testimonial.${socialProof.testimonial.id}.initials`]()}
					</div>
					<div>
						<p class="font-semibold">
							{m[`home.socialProof.testimonial.${socialProof.testimonial.id}.name`]()}
						</p>
						<p class="text-sm text-muted-foreground">
							{m[`home.socialProof.testimonial.${socialProof.testimonial.id}.role`]()}
						</p>
					</div>
					<span
						class="ml-auto rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
					>
						{m['home.socialProof.demoLabel']()}
					</span>
				</figcaption>
			</figure>
		</div>
	</Container>
</section>
