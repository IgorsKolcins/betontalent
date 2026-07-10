<script lang="ts">
	import './layout.css';
	import { untrack } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import { createThemeContext } from '$lib/contexts/Theme.svelte';
	import { setupI18n } from '$lib/i18n';

	let { children, data } = $props();
	const theme = createThemeContext(untrack(() => data.theme));
	setupI18n(untrack(() => data.locale));

	$effect(() => {
		theme.apply();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Header />
{@render children()}
