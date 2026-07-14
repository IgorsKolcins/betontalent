<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime.js';
</script>

<Container as="section" class="pb-16 md:pb-24" aria-labelledby="final-cta-title">
	<div
		class="overflow-hidden rounded-xl bg-primary px-6 py-12 text-center text-primary-foreground shadow-xl md:px-12 md:py-16"
	>
		<h2 id="final-cta-title" class="text-3xl font-bold tracking-tight md:text-4xl">
			{m['home.finalCta.title']()}
		</h2>
		<p class="mx-auto mt-4 max-w-xl leading-7 text-primary-foreground/70">
			{m['home.finalCta.description']()}
		</p>
		<Button
			href={resolve(localizeHref('/login') as '/login')}
			class="group mt-7 h-11 px-5 bg-accent text-accent-foreground hover:bg-accent/90 dark:hover:bg-accent/85"
		>
			{m['home.finalCta.cta']()}
			<ArrowRight
				aria-hidden="true"
				class="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
			/>
		</Button>
	</div>
</Container>
