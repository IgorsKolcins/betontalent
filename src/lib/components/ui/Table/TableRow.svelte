<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	let {
		children,
		class: className,
		...restProps
	}: HTMLAttributes<HTMLTableRowElement> & { children: Snippet; class?: string } = $props();
</script>

<tr
	data-slot="table-row"
	class={cn('border-b border-border transition-colors hover:bg-muted/50', className)}
	{...restProps}
>
	{@render children()}
</tr>
