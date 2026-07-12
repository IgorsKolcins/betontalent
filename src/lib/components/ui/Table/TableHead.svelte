<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLThAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	let {
		children,
		class: className,
		...restProps
	}: HTMLThAttributes & { children: Snippet; class?: string } = $props();
</script>

<th
	data-slot="table-head"
	class={cn(
		'h-11 px-4 text-left align-middle text-xs font-semibold tracking-wide text-muted-foreground uppercase',
		className
	)}
	{...restProps}
>
	{@render children()}
</th>
