<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type CardFooterProps = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		class?: string;
	};

	let { children, class: className, ...restProps }: CardFooterProps = $props();
</script>

<div
	data-slot="card-footer"
	class={cn(
		'flex items-center gap-2 rounded-b-lg border-t border-border bg-muted/50 p-(--card-spacing)',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
