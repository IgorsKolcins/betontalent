<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<svelte:head>
	<title>{$_('app.title')}</title>
	<meta name="description" content={$_('app.description')} />
</svelte:head>

<main class="min-h-screen py-12 md:py-16">
	<section class="container py-12 md:py-16" aria-labelledby="home-title">
		<h1
			id="home-title"
			class="text-[clamp(2.75rem,9vw,5.75rem)] leading-[0.95] font-[760] text-foreground"
		>
			{$_('home.assignment.title')}
		</h1>
		<p class="mt-6 max-w-xl text-[clamp(1rem,1.5vw,1.125rem)] leading-7 text-muted-foreground">
			{$_('home.assignment.description')}
		</p>
	</section>
</main>
