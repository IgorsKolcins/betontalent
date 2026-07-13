<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getSidebarContext } from './SidebarContext.svelte';
	import { cn } from '$lib/utils/cn';

	let {
		children,
		class: className
	}: {
		children: Snippet;
		class?: string;
	} = $props();

	getSidebarContext();
</script>

<div
	data-slot="sidebar-inset-container"
	class={cn('mx-auto w-full max-w-(--sidebar-content-max-width) p-5 sm:p-6 lg:p-10', className)}
>
	{@render children()}
</div>
