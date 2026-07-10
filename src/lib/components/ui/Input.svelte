<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	let {
		class: className,
		value = $bindable(undefined),
		button,
		...rest
	}: HTMLInputAttributes & { value?: string; button?: Snippet } = $props();

	const inputWrapperStyles =
		'rounded-md border border-input bg-background shadow-sm transition-colors duration-150 hover:border-ring focus-within:border-ring focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring';
</script>

{#snippet input()}
	<input
		class={cn(
			'min-h-10 min-w-0 flex-1 rounded-md bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
			!button && inputWrapperStyles,
			className
		)}
		bind:value
		{...rest}
	/>
{/snippet}

{#if button}
	<div class={cn('flex min-w-0', inputWrapperStyles)}>
		{@render input()}
		{@render button()}
	</div>
{:else}
	{@render input()}
{/if}
