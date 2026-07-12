<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import type { Snippet } from 'svelte';

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
	class={twMerge('relative flex min-h-svh w-full min-w-0 flex-1 flex-col bg-background', className)}
>
	{@render children()}
</main>
