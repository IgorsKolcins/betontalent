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

<thead data-slot="table-header" class={cn('[&_tr]:border-b', className)} {...restProps}>
	{@render children()}
</thead>
