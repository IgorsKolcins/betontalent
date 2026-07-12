<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	let {
		children,
		class: className,
		...restProps
	}: HTMLAttributes<HTMLTableSectionElement> & { children: Snippet; class?: string } = $props();
</script>

<tbody data-slot="table-body" class={cn('[&_tr:last-child]:border-0', className)} {...restProps}>
	{@render children()}
</tbody>
