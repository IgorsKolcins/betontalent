<script lang="ts">
	import { LoaderCircle } from '@lucide/svelte';
	import { cn } from '$lib/utils/cn';

	let { class: className }: { class?: string } = $props();
</script>

<LoaderCircle aria-hidden="true" class={cn('size-4 shrink-0 animate-spin', className)} />
