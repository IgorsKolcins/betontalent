<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m['app.title']()}</title>
	<meta name="description" content={m['app.description']()} />
	<link rel="canonical" href={data.seo.canonical} />
	{#each data.seo.alternates as alternate (alternate.hreflang)}
		<link rel="alternate" hreflang={alternate.hreflang} href={alternate.href} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={data.seo.xDefault} />
</svelte:head>

<main class="min-h-screen py-12 md:py-16">
	<section class="container py-12 md:py-16" aria-labelledby="home-title">
		<h1
			id="home-title"
			class="text-[clamp(2.75rem,9vw,5.75rem)] leading-[0.95] font-[760] text-foreground"
		>
			{m['home.assignment.title']()}
		</h1>
		<p class="mt-6 max-w-xl text-[clamp(1rem,1.5vw,1.125rem)] leading-7 text-muted-foreground">
			{m['home.assignment.description']()}
		</p>
	</section>
</main>
