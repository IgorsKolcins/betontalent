<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';

	let { open = $bindable(false), ...rootProps }: DialogPrimitive.RootProps = $props();
</script>

<DialogPrimitive.Root bind:open {...rootProps} />
