<script lang="ts">
	import type { Snippet } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import { createThemeContext, getInitialThemeMode } from '$lib/contexts/Theme.svelte';

	let { children }: { children: Snippet } = $props();
	const theme = createThemeContext(getInitialThemeMode());

	$effect(() => {
		theme.apply();
	});
</script>

<Header />
{@render children()}
