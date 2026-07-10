<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type CardTitleProps = HTMLAttributes<HTMLHeadingElement> & {
		children?: Snippet;
		class?: string;
	};

	let { children, class: className, ...restProps }: CardTitleProps = $props();
</script>

<h3
	data-slot="card-title"
	class={cn('text-base font-semibold text-foreground', className)}
	{...restProps}
>
	{@render children?.()}
</h3>
