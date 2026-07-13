<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ArrowLeft } from '@lucide/svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime.js';

	const isNotFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title
		>{isNotFound ? m['error.404.metaTitle']() : m['common.error']()} | {m['brand.name']()}</title
	>
	<meta
		name="description"
		content={isNotFound ? m['error.404.metaDescription']() : m['app.description']()}
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Container as="main" class="grid min-h-[calc(100vh-3.5rem)] place-items-center py-12">
	<section
		class="relative w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card px-6 py-16 text-center shadow-sm md:px-12 md:py-24"
	>
		<div aria-hidden="true" class="absolute inset-0 opacity-50">
			<span class="absolute top-[12%] left-[9%] size-1 rounded-full bg-foreground"></span>
			<span class="absolute top-[22%] right-[14%] size-1.5 rounded-full bg-brand"></span>
			<span class="absolute bottom-[18%] left-[18%] size-1.5 rounded-full bg-muted-foreground"
			></span>
			<span class="absolute right-[8%] bottom-[30%] size-1 rounded-full bg-foreground"></span>
			<span class="absolute top-[42%] left-[5%] size-0.5 rounded-full bg-muted-foreground"></span>
		</div>

		<div class="relative">
			<p class="text-sm font-semibold tracking-[0.3em] text-brand uppercase">{page.status}</p>
			<p
				class="mt-3 text-[clamp(5rem,24vw,11rem)] leading-none font-black tracking-[-0.09em] text-foreground"
				aria-hidden="true"
			>
				{isNotFound ? '404' : page.status}
			</p>
			<h1 class="mx-auto mt-6 max-w-xl text-3xl text-foreground md:text-4xl">
				{isNotFound ? m['error.404.title']() : m['common.error']()}
			</h1>
			{#if isNotFound}
				<p class="mx-auto mt-4 max-w-lg text-base leading-7 text-muted-foreground">
					{m['error.404.description']()}
				</p>
			{/if}
			<a
				href={resolve(localizeHref('/') as '/')}
				class="mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]"
			>
				<ArrowLeft aria-hidden="true" class="size-4" />
				{m['error.404.home']()}
			</a>
		</div>
	</section>
</Container>
