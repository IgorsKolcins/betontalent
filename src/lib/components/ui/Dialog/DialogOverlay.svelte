<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/cn';

	let { class: className, ...overlayProps }: DialogPrimitive.OverlayProps = $props();
</script>

<DialogPrimitive.Overlay
	data-slot="dialog-overlay"
	class={cn(
		'fixed inset-0 z-50 bg-foreground/40 data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none',
		className
	)}
	{...overlayProps}
/>
