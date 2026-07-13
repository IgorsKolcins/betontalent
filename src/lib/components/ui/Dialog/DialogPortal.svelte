<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';

	let { ...portalProps }: DialogPrimitive.PortalProps = $props();
</script>

<DialogPrimitive.Portal {...portalProps} />
