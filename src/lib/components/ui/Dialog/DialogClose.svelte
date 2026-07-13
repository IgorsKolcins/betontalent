<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';

	let { ...closeProps }: DialogPrimitive.CloseProps = $props();
</script>

<DialogPrimitive.Close data-slot="dialog-close" {...closeProps} />
