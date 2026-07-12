<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	let {
		children,
		class: className,
		...restProps
	}: HTMLAttributes<HTMLElement> & { children: Snippet; class?: string } = $props();
</script>

<caption
	data-slot="table-caption"
	class={cn('mt-4 text-sm text-muted-foreground', className)}
	{...restProps}
>
	{@render children()}
</caption>
