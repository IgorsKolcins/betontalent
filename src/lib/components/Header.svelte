<script lang="ts">
	import { resolve } from '$app/paths';
	import { Moon, Sun } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { getThemeContext } from '$lib/contexts/Theme.svelte';

	const theme = getThemeContext();
</script>

<header class="border-b border-border bg-background/90 backdrop-blur">
	<div class="container flex h-14 items-center justify-between gap-4">
		<a href={resolve('/')} class="text-sm font-bold tracking-[0.08em] text-foreground uppercase">
			Bet On Talent
		</a>

		<div class="flex items-center gap-2">
			<Button
				variant="icon"
				onclick={() => theme.toggle()}
				aria-label={theme.mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
				title={theme.mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
			>
				{#if theme.mode === 'dark'}
					<Sun aria-hidden="true" class="size-4" />
				{:else}
					<Moon aria-hidden="true" class="size-4" />
				{/if}
			</Button>
		</div>
	</div>
</header>
