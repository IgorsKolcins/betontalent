<script lang="ts">
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import { Pagination } from 'bits-ui';
	import { m } from '$lib/paraglide/messages.js';
	import { cn } from '$lib/utils/cn';

	let {
		class: className,
		count,
		perPage,
		page = $bindable(1),
		ref = $bindable(null),
		...restRoot
	}: Pagination.RootProps & { class?: string; count: number; perPage: number } = $props();
</script>

<Pagination.Root
	{count}
	{perPage}
	bind:page
	bind:ref
	class={cn('grid grid-cols-3 my-8 items-center', className)}
	{...restRoot}
>
	{#snippet children({ pages, range })}
		<p class="text-xs font-medium text-muted-foreground">
			{m['pagination.range']({ start: range.start, end: range.end })}
		</p>
		<div class="flex items-center justify-center gap-2">
			<Pagination.PrevButton
				aria-label={m['pagination.previous']()}
				title={m['pagination.previous']()}
				class={cn(
					'inline-flex size-10 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground shadow-sm transition-colors duration-150 hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
					'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground'
				)}
			>
				<ArrowLeft aria-hidden="true" class="size-4" />
			</Pagination.PrevButton>
			<div class="flex items-center gap-1.5">
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<div
							class="flex size-10 select-none items-center justify-center text-sm font-medium text-muted-foreground"
						>
							...
						</div>
					{:else}
						<Pagination.Page
							{page}
							aria-label={m['pagination.page']({ page: page.value })}
							title={m['pagination.page']({ page: page.value })}
							class={cn(
								'inline-flex size-10 cursor-pointer select-none items-center justify-center rounded-md border border-border bg-background text-sm font-medium text-foreground shadow-sm transition-colors duration-150 hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
								'data-selected:border-brand data-selected:bg-brand data-selected:text-brand-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-foreground'
							)}
						>
							{page.value}
						</Pagination.Page>
					{/if}
				{/each}
			</div>
			<Pagination.NextButton
				aria-label={m['pagination.next']()}
				title={m['pagination.next']()}
				class={cn(
					'inline-flex size-10 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground shadow-sm transition-colors duration-150 hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
					'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground'
				)}
			>
				<ArrowRight aria-hidden="true" class="size-4" />
			</Pagination.NextButton>
		</div>
		<div></div>
	{/snippet}
</Pagination.Root>
