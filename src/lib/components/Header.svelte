<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { BookOpen, LayoutDashboard, LogIn, Menu, Moon, Search, Sun } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import { getThemeContext } from '$lib/contexts/Theme.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { deLocalizeHref, getLocale, localizeHref, type Locale } from '$lib/paraglide/runtime.js';
	import { cn } from '$lib/utils/cn';

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

{#snippet appearanceControls(close: (() => void) | undefined, fill: boolean)}
	<Button
		href={localeHref}
		variant="secondary"
		data-sveltekit-reload
		onclick={close}
		class={cn('h-9', { 'flex-1': fill })}
		aria-label={m['language.toggle']({ locale: nextLocale.toUpperCase() })}
		title={m['language.toggle']({ locale: nextLocale.toUpperCase() })}
	>
		<span class={cn('text-muted-foreground', { 'text-foreground': activeLocale === 'en' })}>EN</span
		>
		<span class="text-muted-foreground">/</span>
		<span class={cn('text-muted-foreground', { 'text-foreground': activeLocale === 'de' })}>DE</span
		>
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
{/snippet}

<header class="border-b border-border bg-background/90 backdrop-blur">
	<Container class="flex h-14 items-center justify-between gap-4 md:grid md:grid-cols-3">
		<a
			href={resolve(localizeHref('/') as '/')}
			class="text-sm font-bold tracking-[0.08em] text-foreground uppercase"
		>
			{m['brand.name']()}
		</a>
		<nav class="hidden items-center justify-center gap-1 md:flex" aria-label={m['nav.primary']()}>
			<Button href={resolve(localizeHref('/blog') as '/')} variant="ghost">
				{m['nav.blog']()}
			</Button>
			<Button href={resolve(localizeHref('/search') as '/')} variant="ghost">
				{m['nav.search']()}
			</Button>
		</nav>
		<div class="hidden items-center justify-end gap-2 md:flex">
			{#if page.data.user}
				<Button href={resolve(localizeHref('/dashboard') as '/dashboard')} class="h-9">
					{m['nav.dashboard']()}
				</Button>
			{:else}
				<Button href={resolve(localizeHref('/login') as '/login')} class="h-9">
					{m['nav.login']()}
				</Button>
			{/if}
			{@render appearanceControls(undefined, false)}
		</div>
		<div class="md:hidden">
			<Drawer title={m['nav.primary']()} closeLabel={m['nav.closeMenu']()}>
				{#snippet trigger(triggerProps)}
					<Button
						{...triggerProps}
						variant="icon"
						aria-label={m['nav.openMenu']()}
						title={m['nav.openMenu']()}
					>
						<Menu aria-hidden="true" class="size-4" />
					</Button>
				{/snippet}
				{#snippet children({ close })}
					<div class="flex min-h-16 items-center border-b border-border px-5 pr-14">
						<a
							href={resolve(localizeHref('/') as '/')}
							onclick={close}
							class="text-sm font-bold tracking-[0.08em] text-foreground uppercase"
						>
							{m['brand.name']()}
						</a>
					</div>

					<nav
						class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3"
						aria-label={m['nav.primary']()}
					>
						<Button
							href={resolve(localizeHref('/blog') as '/')}
							variant="ghost"
							onclick={close}
							class="h-10 w-full justify-start gap-3"
						>
							<BookOpen aria-hidden="true" class="size-4" />
							{m['nav.blog']()}
						</Button>
						<Button
							href={resolve(localizeHref('/search') as '/')}
							variant="ghost"
							onclick={close}
							class="h-10 w-full justify-start gap-3"
						>
							<Search aria-hidden="true" class="size-4" />
							{m['nav.search']()}
						</Button>
						{#if page.data.user}
							<Button
								href={resolve(localizeHref('/dashboard') as '/dashboard')}
								variant="ghost"
								onclick={close}
								class="h-10 w-full justify-start gap-3"
							>
								<LayoutDashboard aria-hidden="true" class="size-4" />
								{m['nav.dashboard']()}
							</Button>
						{:else}
							<Button
								href={resolve(localizeHref('/login') as '/login')}
								variant="ghost"
								onclick={close}
								class="h-10 w-full justify-start gap-3"
							>
								<LogIn aria-hidden="true" class="size-4" />
								{m['nav.login']()}
							</Button>
						{/if}
					</nav>

					<div class="mt-auto flex items-center gap-2 border-t border-border p-3">
						{@render appearanceControls(close, true)}
					</div>
				{/snippet}
			</Drawer>
		</div>
	</Container>
</header>
