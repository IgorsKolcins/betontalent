<script lang="ts">
	import './layout.css';
	import { untrack } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { createThemeContext } from '$lib/contexts/Theme.svelte';

	let { children, data } = $props();
	const theme = createThemeContext(untrack(() => data.theme));

	$effect(() => {
		theme.apply();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
