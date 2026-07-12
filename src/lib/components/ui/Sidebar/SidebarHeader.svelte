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

<div
	data-slot="sidebar-header"
	class={cn(
		'flex min-h-16 flex-col justify-center gap-2 border-b border-border px-5 py-3',
		className
	)}
>
	{@render children()}
</div>
