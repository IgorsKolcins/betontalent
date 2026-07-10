<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
		children?: Snippet;
		class?: string;
	};

	let { children, class: className, ...restProps }: CardDescriptionProps = $props();
</script>

<p
	data-slot="card-description"
	class={cn('text-sm leading-5 text-muted-foreground', className)}
	{...restProps}
>
	{@render children?.()}
</p>
