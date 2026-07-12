<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { House, LayoutDashboard, List, Menu, Moon, Sun } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarGroup,
		SidebarHeader,
		SidebarInset,
		SidebarInsetContainer,
		SidebarMenu,
		SidebarMenuButton,
		SidebarProvider
	} from '$lib/components/ui/Sidebar';
	import { getThemeContext } from '$lib/contexts/Theme.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { deLocalizeHref, getLocale, localizeHref, type Locale } from '$lib/paraglide/runtime.js';

	let { children }: { children: Snippet } = $props();

	const theme = getThemeContext();
	const activeLocale = $derived(getLocale());
	const nextLocale = $derived((activeLocale === 'en' ? 'de' : 'en') satisfies Locale);
	const currentPath = $derived(deLocalizeHref(page.url.pathname));
	const dashboardHref = $derived(resolve(localizeHref('/dashboard') as '/dashboard'));
	const itemsHref = $derived(resolve(localizeHref('/dashboard/items') as '/dashboard/items'));
	const homeHref = $derived(resolve(localizeHref('/') as '/'));
	const localeHref = $derived(
		resolve(
			localizeHref(deLocalizeHref(`${page.url.pathname}${page.url.search}`), {
				locale: nextLocale
			}) as '/'
		)
	);
</script>

<SidebarProvider>
	<Sidebar>
		<SidebarHeader>
			<a href={dashboardHref} class="text-sm font-bold tracking-[0.08em] text-foreground uppercase">
				{m['brand.name']()}
			</a>
		</SidebarHeader>

		<SidebarContent>
			<SidebarGroup>
				<SidebarMenu aria-label={m['dashboard.sidebar.navigationLabel']()}>
					<SidebarMenuButton href={dashboardHref} isActive={currentPath === '/dashboard'}>
						<LayoutDashboard aria-hidden="true" class="size-4" />
						<span>{m['nav.dashboard']()}</span>
					</SidebarMenuButton>
					<SidebarMenuButton href={itemsHref} isActive={currentPath.startsWith('/dashboard/items')}>
						<List aria-hidden="true" class="size-4" />
						<span>{m['nav.items']()}</span>
					</SidebarMenuButton>
					<SidebarMenuButton href={homeHref} isActive={currentPath === '/'}>
						<House aria-hidden="true" class="size-4" />
						<span>{m['nav.home']()}</span>
					</SidebarMenuButton>
				</SidebarMenu>
			</SidebarGroup>
		</SidebarContent>

		<SidebarFooter>
			<div class="flex items-center gap-2">
				<Button
					href={localeHref}
					variant="secondary"
					data-sveltekit-reload
					class="h-9 flex-1"
					aria-label={m['language.toggle']({ locale: nextLocale.toUpperCase() })}
					title={m['language.toggle']({ locale: nextLocale.toUpperCase() })}
				>
					<span class={activeLocale === 'en' ? 'text-foreground' : 'text-muted-foreground'}>EN</span
					>
					<span class="text-muted-foreground">/</span>
					<span class={activeLocale === 'de' ? 'text-foreground' : 'text-muted-foreground'}>DE</span
					>
				</Button>
				<Button
					variant="icon"
					onclick={() => theme.toggle()}
					aria-label={theme.mode === 'dark'
						? m['theme.switchToLight']()
						: m['theme.switchToDark']()}
					title={theme.mode === 'dark' ? m['theme.switchToLight']() : m['theme.switchToDark']()}
				>
					{#if theme.mode === 'dark'}
						<Sun aria-hidden="true" class="size-4" />
					{:else}
						<Moon aria-hidden="true" class="size-4" />
					{/if}
				</Button>
			</div>
		</SidebarFooter>
	</Sidebar>

	<SidebarInset>
		<div
			class="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 lg:hidden"
		>
			<a href={dashboardHref} class="text-sm font-bold tracking-[0.08em] text-foreground uppercase">
				{m['brand.shortName']()}
			</a>
			<Button
				variant="icon"
				disabled
				aria-label={m['dashboard.sidebar.mobileMenuUnavailable']()}
				title={m['dashboard.sidebar.mobileMenuUnavailable']()}
			>
				<Menu aria-hidden="true" class="size-4" />
			</Button>
		</div>
		<SidebarInsetContainer>
			{@render children()}
		</SidebarInsetContainer>
	</SidebarInset>
</SidebarProvider>
