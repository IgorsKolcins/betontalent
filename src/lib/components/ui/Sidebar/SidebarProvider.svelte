<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import { createSidebarContext } from './SidebarContext.svelte';

	let {
		children,
		width,
		contentMaxWidth
	}: {
		children: Snippet;
		width?: string;
		contentMaxWidth?: string;
	} = $props();

	const sidebar = createSidebarContext(untrack(() => ({ width, contentMaxWidth })));
</script>

<div
	data-slot="sidebar-wrapper"
	class="flex min-h-svh w-full flex-col lg:flex-row"
	style:--sidebar-width={sidebar.width}
	style:--sidebar-content-max-width={sidebar.contentMaxWidth}
>
	{@render children()}
</div>
