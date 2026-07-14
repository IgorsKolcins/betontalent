<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import ScrollArea from '$lib/components/ui/ScrollArea.svelte';
	import DelayedLoading from '$lib/components/ui/DelayedLoading.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { cn } from '$lib/utils/cn';

	type TableProps = HTMLTableAttributes & {
		children: Snippet;
		class?: string;
		scrollAreaLabel: string;
		loading?: boolean;
		loadingLabel?: string;
	};

	let {
		children,
		class: className,
		scrollAreaLabel,
		loading = false,
		loadingLabel,
		...restProps
	}: TableProps = $props();
</script>

<ScrollArea
	class="rounded-lg border border-border bg-card pb-2 shadow-sm"
	viewportLabel={scrollAreaLabel}
>
	{#if loading && loadingLabel}
		<DelayedLoading>
			<div class="sticky top-2 left-2 z-20 h-0 w-fit overflow-visible" role="status">
				<span
					class="inline-flex translate-y-2 items-center gap-2 rounded-md border border-border bg-background/95 px-3 py-2 text-xs font-medium text-foreground shadow-md backdrop-blur"
				>
					<LoadingSpinner />
					{loadingLabel}
				</span>
			</div>
		</DelayedLoading>
	{/if}
	<table
		data-slot="table"
		class={cn('w-full min-w-5xl border-collapse text-sm', className)}
		aria-busy={loading}
		{...restProps}
	>
		{@render children()}
	</table>
</ScrollArea>
