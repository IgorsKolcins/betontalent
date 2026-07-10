<script lang="ts">
	import { resolve } from '$app/paths';
	import { Moon, Sun } from '@lucide/svelte';
	import { _, locale } from 'svelte-i18n';
	import Button from '$lib/components/ui/Button.svelte';
	import { getThemeContext } from '$lib/contexts/Theme.svelte';
	import { getNextLocale, toggleLocale, type Locale } from '$lib/i18n';

	const theme = getThemeContext();
	const activeLocale = $derived(($locale ?? 'en') as Locale);
	const nextLocale = $derived(getNextLocale(activeLocale));
</script>

<header class="border-b border-border bg-background/90 backdrop-blur">
	<div class="container flex h-14 items-center justify-between gap-4">
		<a href={resolve('/')} class="text-sm font-bold tracking-[0.08em] text-foreground uppercase">
			{$_('brand.name')}
		</a>

		<div class="flex items-center gap-2">
			<Button
				variant="secondary"
				class="h-9 px-3 text-xs"
				onclick={() => toggleLocale(activeLocale)}
				aria-label={$_('language.toggle', { values: { locale: nextLocale.toUpperCase() } })}
				title={$_('language.toggle', { values: { locale: nextLocale.toUpperCase() } })}
			>
				<span class={activeLocale === 'en' ? 'text-foreground' : 'text-muted-foreground'}>EN</span>
				<span class="text-muted-foreground">/</span>
				<span class={activeLocale === 'de' ? 'text-foreground' : 'text-muted-foreground'}>DE</span>
			</Button>
			<Button
				variant="icon"
				onclick={() => theme.toggle()}
				aria-label={theme.mode === 'dark' ? $_('theme.switchToLight') : $_('theme.switchToDark')}
				title={theme.mode === 'dark' ? $_('theme.switchToLight') : $_('theme.switchToDark')}
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
