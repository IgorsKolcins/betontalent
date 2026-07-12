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
	<div class="container grid grid-cols-3 h-14 items-center gap-4">
		<a
			href={resolve(localizeHref('/') as '/')}
			class="text-sm font-bold tracking-[0.08em] text-foreground uppercase"
		>
			{m['brand.name']()}
		</a>
		<nav class="hidden items-center gap-1 md:flex justify-center" aria-label={m['nav.primary']()}>
			<Button href={resolve(localizeHref('/blog') as '/')} variant="ghost">
				{m['nav.blog']()}
			</Button>
			<Button href={resolve(localizeHref('/search') as '/')} variant="ghost">
				{m['nav.search']()}
			</Button>
		</nav>
		<div class="flex items-center gap-2 justify-end">
			{#if page.data.user}
				<Button
					href={resolve(localizeHref('/dashboard') as '/dashboard')}
					class="hidden h-9 sm:inline-flex"
				>
					{m['nav.dashboard']()}
				</Button>
			{:else}
				<Button href={resolve(localizeHref('/login') as '/login')} class="h-9">
					{m['nav.login']()}
				</Button>
			{/if}
			<Button
				href={localeHref}
				variant="secondary"
				data-sveltekit-reload
				class="h-9"
				aria-label={m['language.toggle']({ locale: nextLocale.toUpperCase() })}
				title={m['language.toggle']({ locale: nextLocale.toUpperCase() })}
			>
				<span class={activeLocale === 'en' ? 'text-foreground' : 'text-muted-foreground'}>EN</span>
				<span class="text-muted-foreground">/</span>
				<span class={activeLocale === 'de' ? 'text-foreground' : 'text-muted-foreground'}>DE</span>
			</Button>
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
