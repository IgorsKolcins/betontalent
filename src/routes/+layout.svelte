<script lang="ts">
	import './layout.css';
	import { untrack } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import { createThemeContext } from '$lib/contexts/Theme.svelte';

	let { children, data } = $props();
	const theme = createThemeContext(untrack(() => data.theme));

	$effect(() => {
		theme.apply();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Header />
{@render children()}
