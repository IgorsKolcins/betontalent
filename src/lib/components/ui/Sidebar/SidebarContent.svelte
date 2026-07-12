<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<div data-slot="sidebar-content" class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
	{@render children()}
</div>
