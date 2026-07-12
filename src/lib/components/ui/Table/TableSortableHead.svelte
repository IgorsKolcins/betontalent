<script lang="ts">
	import { ArrowDown, ArrowUp, ArrowUpDown } from '@lucide/svelte';
	import type { HTMLThAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';
	import TableHead from './TableHead.svelte';

	type SortDirection = 'ascending' | 'descending' | 'none';

	type SortableHeadProps = Omit<HTMLThAttributes, 'children' | 'onclick'> & {
		class?: string;
		label: string;
		onclick: () => void;
		sortDirection?: SortDirection;
		sortLabel: string;
	};

	let {
		class: className,
		label,
		onclick,
		sortDirection = 'none',
		sortLabel,
		...restProps
	}: SortableHeadProps = $props();
</script>

<TableHead class={className} aria-sort={sortDirection} {...restProps}>
	<button
		type="button"
		{onclick}
		class={cn(
			'inline-flex items-center gap-1.5 rounded-sm text-left hover:text-foreground',
			className?.includes('text-right') && 'w-full justify-end'
		)}
		aria-label={sortLabel}
		title={sortLabel}
	>
		<span>{label}</span>
		{#if sortDirection === 'ascending'}
			<ArrowUp aria-hidden="true" class="size-3.5" />
		{:else if sortDirection === 'descending'}
			<ArrowDown aria-hidden="true" class="size-3.5" />
		{:else}
			<ArrowUpDown aria-hidden="true" class="size-3.5 opacity-50" />
		{/if}
	</button>
</TableHead>
