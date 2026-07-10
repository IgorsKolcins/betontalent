<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type CardContentProps = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		class?: string;
	};

	let { children, class: className, ...restProps }: CardContentProps = $props();
</script>

<div data-slot="card-content" class={cn('px-(--card-spacing)', className)} {...restProps}>
	{@render children?.()}
</div>
