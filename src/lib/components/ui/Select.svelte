<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	let {
		class: className,
		value = $bindable(undefined),
		children,
		...rest
	}: HTMLSelectAttributes & { value?: string; children?: Snippet } = $props();
</script>

<div class="relative min-w-0">
	<select
		class={cn(
			'min-h-10 w-full min-w-0 appearance-none rounded-md border border-input bg-background py-2 pr-9 pl-3 text-sm text-foreground shadow-sm outline-none transition-colors duration-150',
			'cursor-pointer hover:border-ring focus:border-ring focus:outline-2 focus:outline-offset-2 focus:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		bind:value
		{...rest}
	>
		{@render children?.()}
	</select>
	<ChevronDown
		aria-hidden="true"
		class="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
	/>
</div>
