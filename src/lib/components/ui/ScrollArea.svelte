<script lang="ts">
	import { ScrollArea } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	let {
		children,
		class: className,
		viewportClass,
		viewportLabel
	}: {
		children: Snippet;
		class?: string;
		viewportClass?: string;
		viewportLabel?: string;
	} = $props();
</script>

<ScrollArea.Root
	class={cn('relative w-full min-w-0 max-w-full overflow-hidden', className)}
	type="auto"
>
	<ScrollArea.Viewport
		class={cn('size-full min-w-0 max-w-full rounded-[inherit]', viewportClass)}
		tabindex={viewportLabel ? 0 : undefined}
		aria-label={viewportLabel}
	>
		{@render children()}
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar
		orientation="horizontal"
		class="flex h-2.5 max-w-full touch-none border-t border-t-transparent bg-muted p-px transition-colors select-none"
	>
		<ScrollArea.Thumb class="relative rounded-full bg-muted-foreground/50" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Corner />
</ScrollArea.Root>
