<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	let {
		children,
		class: className
	}: {
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div data-slot="sidebar-group" class={cn('relative flex w-full min-w-0 flex-col p-3', className)}>
	{@render children()}
</div>
