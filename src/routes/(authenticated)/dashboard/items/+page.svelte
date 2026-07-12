<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
</script>

<svelte:head>
	<title>{m['dashboard.items.metaTitle']()}</title>
	<meta name="description" content={m['dashboard.items.metaDescription']()} />
</svelte:head>

<section class="py-8 md:py-12" aria-labelledby="items-title">
	<h1 id="items-title">{m['dashboard.items.title']()}</h1>
</section>
