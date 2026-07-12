<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import ScrollArea from '$lib/components/ui/ScrollArea.svelte';
	import { cn } from '$lib/utils/cn';

	type TableProps = HTMLTableAttributes & {
		children: Snippet;
		class?: string;
		scrollAreaLabel: string;
	};

	let { children, class: className, scrollAreaLabel, ...restProps }: TableProps = $props();
</script>

<ScrollArea
	class="rounded-lg border border-border bg-card pb-2 shadow-sm"
	viewportLabel={scrollAreaLabel}
>
	<table
		data-slot="table"
		class={cn('w-full min-w-5xl border-collapse text-sm', className)}
		{...restProps}
	>
		{@render children()}
	</table>
</ScrollArea>
