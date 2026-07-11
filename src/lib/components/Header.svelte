<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { Moon, Sun } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { getThemeContext } from '$lib/contexts/Theme.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { deLocalizeHref, getLocale, localizeHref, type Locale } from '$lib/paraglide/runtime.js';

	const theme = getThemeContext();
	const activeLocale = $derived(getLocale());
	const nextLocale = $derived((activeLocale === 'en' ? 'de' : 'en') satisfies Locale);
	const localeHref = $derived(
		resolve(
			localizeHref(deLocalizeHref(`${page.url.pathname}${page.url.search}`), {
				locale: nextLocale
			}) as '/'
		)
	);
</script>

<header class="border-b border-border bg-background/90 backdrop-blur">
	<div class="container flex h-14 items-center justify-between gap-4">
		<a
			href={resolve(localizeHref('/') as '/')}
			class="text-sm font-bold tracking-[0.08em] text-foreground uppercase"
		>
			{m['brand.name']()}
		</a>
		<nav class="hidden items-center gap-1 md:flex" aria-label={m['nav.primary']()}>
			<a
				href={resolve(localizeHref('/blog') as '/')}
				class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
				>{m['nav.blog']()}</a
			>
			<a
				href={resolve(localizeHref('/search') as '/')}
				class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
				>{m['nav.search']()}</a
			>
		</nav>
		<div class="flex items-center gap-2">
			<a
				href={localeHref}
				data-sveltekit-reload
				class="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-3 text-xs font-semibold text-secondary-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.98]"
				aria-label={m['language.toggle']({ locale: nextLocale.toUpperCase() })}
				title={m['language.toggle']({ locale: nextLocale.toUpperCase() })}
			>
				<span class={activeLocale === 'en' ? 'text-foreground' : 'text-muted-foreground'}>EN</span>
				<span class="text-muted-foreground">/</span>
				<span class={activeLocale === 'de' ? 'text-foreground' : 'text-muted-foreground'}>DE</span>
			</a>
			<Button
				variant="icon"
				onclick={() => theme.toggle()}
				aria-label={theme.mode === 'dark' ? m['theme.switchToLight']() : m['theme.switchToDark']()}
				title={theme.mode === 'dark' ? m['theme.switchToLight']() : m['theme.switchToDark']()}
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
