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

<main
	data-slot="sidebar-inset"
	class={cn('relative flex min-h-svh w-full min-w-0 flex-1 flex-col bg-background', className)}
>
	{@render children()}
</main>
