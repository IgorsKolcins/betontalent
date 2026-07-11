<script lang="ts">
	import { Search, X } from '@lucide/svelte';
	import type { HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';
	import Button from './Button.svelte';
	import Input from './Input.svelte';

	type SearchInputProps = Omit<HTMLInputAttributes, 'type' | 'value'> & {
		value?: string;
		clearLabel: string;
		submitLabel: string;
		onClear?: () => void;
		onSubmitClick?: (event: MouseEvent) => void;
		submitType?: HTMLButtonAttributes['type'];
		showClear?: boolean;
		showSubmit?: boolean;
	};

	let {
		value = $bindable(undefined),
		clearLabel,
		submitLabel,
		onClear,
		onSubmitClick,
		submitType = 'submit',
		showClear = true,
		showSubmit = true,
		...inputAttributes
	}: SearchInputProps = $props();

	let inputElement = $state<HTMLInputElement>();

	function clear() {
		value = '';
		onClear?.();
		inputElement?.focus();
	}
</script>

<Input
	{...inputAttributes}
	type="search"
	data-custom-search-input
	bind:value
	bind:element={inputElement}
	wrapperClass="group/search"
>
	{#snippet button()}
		{#if showClear && value}
			<Button
				type="button"
				variant="icon"
				class="invisible size-10 rounded-none border-0 shadow-none group-focus-within/search:visible"
				aria-label={clearLabel}
				title={clearLabel}
				onclick={clear}
			>
				<X aria-hidden="true" class="size-4" />
			</Button>
		{/if}
		{#if showSubmit}
			<Button
				type={submitType}
				variant="icon"
				class="size-10 rounded-l-none rounded-r-md border-y-0 border-r-0 shadow-none"
				aria-label={submitLabel}
				title={submitLabel}
				onclick={onSubmitClick}
			>
				<Search aria-hidden="true" class="size-4" />
			</Button>
		{/if}
	{/snippet}
</Input>
