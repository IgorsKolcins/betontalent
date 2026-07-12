<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import Label from './Label.svelte';

	let {
		class: className,
		error,
		errorId,
		label,
		children
	}: {
		class?: string;
		error?: string;
		errorId?: string;
		label?: string;
		children?: Snippet;
	} = $props();
</script>

<div class={cn('space-y-1.5 pb-6', { 'pt-6': !label }, className)}>
	{#if label}
		<Label>
			<span>{label}</span>
			{@render children?.()}
		</Label>
	{:else}
		{@render children?.()}
	{/if}
	{#if error}
		<p id={errorId} class="-mb-5 text-xs font-medium text-destructive" data-error-message>
			{error}
		</p>
	{/if}
</div>
