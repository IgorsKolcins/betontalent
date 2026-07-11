<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	let {
		class: className,
		wrapperClass,
		value = $bindable(undefined),
		element = $bindable(undefined),
		button,
		...rest
	}: HTMLInputAttributes & {
		value?: string;
		element?: HTMLInputElement;
		button?: Snippet;
		wrapperClass?: string;
	} = $props();

	const inputWrapperStyles = cn(
		'rounded-md border border-input bg-background shadow-sm transition-colors duration-150 hover:border-ring',
		'has-[input:focus-visible]:border-ring has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring'
	);
</script>

{#snippet input()}
	<input
		bind:this={element}
		class={cn(
			'min-h-10 min-w-0 flex-1 rounded-md bg-transparent px-3 py-2 text-sm text-foreground outline-none',
			'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
			!button && inputWrapperStyles,
			className
		)}
		bind:value
		{...rest}
	/>
{/snippet}

{#if button}
	<div class={cn('flex min-w-0', inputWrapperStyles, wrapperClass)}>
		{@render input()}
		{@render button()}
	</div>
{:else}
	{@render input()}
{/if}
