<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import Button from '$lib/components/ui/Button.svelte';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m['dashboard.metaTitle']()}</title>
	<meta name="description" content={m['dashboard.metaDescription']()} />
</svelte:head>

<main class="container py-12 md:py-16">
	<section class="max-w-2xl" aria-labelledby="dashboard-title">
		<p class="mb-2 text-sm font-semibold text-brand">{m[`role.${data.user.role}`]()}</p>
		<h1 id="dashboard-title">{m['dashboard.title']()}</h1>
		<p class="mt-4 text-lg text-muted-foreground">
			{m['dashboard.welcome']({ name: data.user.name })}
		</p>

		<form method="POST" action={resolve(localizeHref('/logout') as '/logout')}>
			<Button type="submit" class="mt-4">{m['nav.logout']()}</Button>
		</form>
	</section>
</main>
