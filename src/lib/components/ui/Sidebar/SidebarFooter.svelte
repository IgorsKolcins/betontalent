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
	data-slot="sidebar-footer"
	class={cn('mt-auto flex flex-col gap-2 border-t border-border p-3', className)}
>
	{@render children()}
</div>
