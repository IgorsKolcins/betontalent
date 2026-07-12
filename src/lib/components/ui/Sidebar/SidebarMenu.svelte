<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type SidebarMenuProps = HTMLAttributes<HTMLElement> & { children: Snippet };

	let { children, ...navProps }: SidebarMenuProps = $props();
</script>

<nav {...navProps} data-slot="sidebar-menu" class="flex w-full min-w-0 flex-col gap-1">
	{@render children()}
</nav>
