<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/cn';

	let { class: className, ...contentProps }: DialogPrimitive.ContentProps = $props();
</script>

<DialogPrimitive.Content
	data-slot="dialog-content"
	class={cn(
		'fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-border bg-background p-6 text-foreground shadow-xl outline-none',
		className
	)}
	{...contentProps}
/>
