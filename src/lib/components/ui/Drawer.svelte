<script lang="ts">
	import { X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import Button from './Button.svelte';
	import {
		Dialog,
		DialogClose,
		DialogContent,
		DialogOverlay,
		DialogPortal,
		DialogTitle,
		DialogTrigger
	} from './Dialog';

	type DrawerTriggerProps = Record<string, unknown>;

	type DrawerContentProps = {
		close: () => void;
	};

	let {
		trigger,
		children,
		title,
		closeLabel,
		class: className
	}: {
		trigger: Snippet<[DrawerTriggerProps]>;
		children: Snippet<[DrawerContentProps]>;
		title: string;
		closeLabel: string;
		class?: string;
	} = $props();

	let open = $state(false);

	function close() {
		open = false;
	}
</script>

<Dialog bind:open>
	<DialogTrigger>
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</DialogTrigger>
	<DialogPortal>
		<DialogOverlay data-slot="drawer-overlay" />
		<DialogContent
			data-slot="drawer-content"
			class={cn(
				'group/drawer-content inset-y-0 right-0 left-auto h-dvh max-h-none w-3/4 max-w-96',
				'translate-x-0 translate-y-0 gap-0 rounded-none border-0 border-l border-border p-0',
				'data-[state=closed]:animate-drawer-out data-[state=open]:animate-drawer-in',
				'motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none',
				className
			)}
		>
			<DialogTitle class="sr-only">{title}</DialogTitle>
			<DialogClose>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="icon"
						aria-label={closeLabel}
						title={closeLabel}
						class="absolute top-3 right-3 z-10"
					>
						<X aria-hidden="true" class="size-4" />
					</Button>
				{/snippet}
			</DialogClose>
			<div class="flex h-full min-h-0 flex-col">
				{@render children({ close })}
			</div>
		</DialogContent>
	</DialogPortal>
</Dialog>
