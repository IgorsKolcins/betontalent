<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/cn';

	let { class: className, ...descriptionProps }: DialogPrimitive.DescriptionProps = $props();
</script>

<DialogPrimitive.Description
	data-slot="dialog-description"
	class={cn('text-sm text-muted-foreground', className)}
	{...descriptionProps}
/>
