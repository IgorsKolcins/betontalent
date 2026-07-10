<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type CardSize = 'default' | 'sm';
	type CardProps = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		class?: string;
		size?: CardSize;
	};

	let { children, class: className, size = 'default', ...restProps }: CardProps = $props();
</script>

<div
	data-slot="card"
	data-size={size}
	class={cn(
		'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-lg border border-border bg-card py-(--card-spacing) text-sm text-card-foreground shadow-sm [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
