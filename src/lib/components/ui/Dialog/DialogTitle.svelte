<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/cn';

	let { class: className, ...titleProps }: DialogPrimitive.TitleProps = $props();
</script>

<DialogPrimitive.Title
	data-slot="dialog-title"
	class={cn('text-lg leading-none font-semibold', className)}
	{...titleProps}
/>
