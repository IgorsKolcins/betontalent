<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	let { children, delay = 100 }: { children: Snippet; delay?: number } = $props();
	let visible = $state(false);

	onMount(() => {
		const timeout = window.setTimeout(() => {
			visible = true;
		}, delay);

		return () => window.clearTimeout(timeout);
	});
</script>

{#if visible}
	{@render children()}
{/if}
