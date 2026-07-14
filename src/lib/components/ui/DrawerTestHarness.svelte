<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import Button from './Button.svelte';
	import Drawer from './Drawer.svelte';
</script>

<Drawer title={m['nav.primary']()} closeLabel={m['nav.closeMenu']()}>
	{#snippet trigger(triggerProps)}
		<Button {...triggerProps} aria-label={m['nav.openMenu']()}>{m['nav.openMenu']()}</Button>
	{/snippet}
	<a href={resolve('/blog')}>{m['nav.blog']()}</a>
</Drawer>
