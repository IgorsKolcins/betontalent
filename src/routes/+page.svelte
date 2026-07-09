<svelte:head>
	<title>Frontend Platform Take-Home</title>
	<meta
		name="description"
		content="A SvelteKit take-home project foundation with semantic theme tokens and a simple public homepage."
	/>
</svelte:head>

<main class="min-h-screen py-12 md:py-16">
	<section class="container py-12 md:py-16" aria-labelledby="home-title">
		<h1
			id="home-title"
			class="text-[clamp(2.75rem,9vw,5.75rem)] leading-[0.95] font-[760] text-foreground"
		>
			Take-home assignment
		</h1>
		<p class="mt-6 max-w-xl text-[clamp(1rem,1.5vw,1.125rem)] leading-7 text-muted-foreground">
			Build a production-shaped slice of a real product in SvelteKit: a public marketing surface and
			an authenticated dashboard. We care about how you reason about architecture, rendering
			boundaries, performance, and trade-offs. Ship less, finish what you ship, and be ready to
			defend every decision.
		</p>
	</section>
</main>
