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

<div aria-hidden="true" class="hidden w-[var(--sidebar-width)] shrink-0 lg:block"></div>
<aside
	data-slot="sidebar"
	class={cn(
		'fixed inset-y-0 left-0 z-20 hidden h-svh w-[var(--sidebar-width)] flex-col border-r border-border bg-background lg:flex',
		className
	)}
>
	{@render children()}
</aside>
