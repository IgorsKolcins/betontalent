<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	let {
		children,
		class: className,
		...restProps
	}: HTMLAttributes<HTMLTableCellElement> & { children: Snippet; class?: string } = $props();
</script>

<td
	data-slot="table-cell"
	class={cn('h-12 px-4 align-middle whitespace-nowrap', className)}
	{...restProps}
>
	{@render children()}
</td>
