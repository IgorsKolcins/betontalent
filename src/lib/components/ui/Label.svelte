<script lang="ts">
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	let { class: className, children }: HTMLLabelAttributes & { class?: string; children?: Snippet } =
		$props();
</script>

<label class={cn('flex min-w-0 flex-col gap-1.5 text-sm font-medium text-foreground', className)}>
	{@render children?.()}
</label>
