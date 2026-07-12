<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type SidebarMenuButtonProps = HTMLAnchorAttributes & {
		children: Snippet;
		isActive?: boolean;
	};

	let {
		children,
		isActive = false,
		class: className,
		...anchorProps
	}: SidebarMenuButtonProps = $props();
</script>

<a
	{...anchorProps}
	data-slot="sidebar-menu-button"
	data-active={isActive}
	aria-current={isActive ? 'page' : undefined}
	class={cn(
		'flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-muted-foreground',
		'transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-brand data-[active=true]:text-brand-foreground',
		className
	)}
>
	{@render children()}
</a>
