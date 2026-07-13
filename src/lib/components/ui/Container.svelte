<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type ContainerElement = 'article' | 'div' | 'main' | 'section';
	type ContainerProps = HTMLAttributes<HTMLElement> & {
		as?: ContainerElement;
		children: Snippet;
	};

	let { as = 'div', children, class: className, ...restProps }: ContainerProps = $props();
</script>

<svelte:element
	this={as}
	data-slot="container"
	class={cn('container mx-auto px-5 md:px-6', className)}
	{...restProps}
>
	{@render children()}
</svelte:element>
