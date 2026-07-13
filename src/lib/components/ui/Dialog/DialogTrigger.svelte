<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';

	let { ...triggerProps }: DialogPrimitive.TriggerProps = $props();
</script>

<DialogPrimitive.Trigger data-slot="dialog-trigger" {...triggerProps} />
