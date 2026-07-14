<script lang="ts">
	import { createLoginSchema } from '$lib/auth/login-schema';
	import { resolve } from '$app/paths';
	import { ArrowLeft, ChartNoAxesCombined, Sparkles } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import DelayedLoading from '$lib/components/ui/DelayedLoading.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { untrack } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const schema = createLoginSchema({
		invalidEmail: m['login.validation.email'](),
		passwordRequired: m['login.validation.password']()
	});
	const { enhance, errors, form, submitting } = superForm(
		untrack(() => data.form),
		{
			validators: zod4Client(schema),
			validationMethod: 'onblur',
			resetForm: false
		}
	);
	const enhanceForm = (element: HTMLFormElement) => {
		const action = enhance(element);
		return () => action.destroy();
	};
</script>

<svelte:head>
	<title>{m['login.metaTitle']()}</title>
	<meta name="description" content={m['login.metaDescription']()} />
	<link rel="canonical" href={data.seo.canonical} />
	{#each data.seo.alternates as alternate (alternate.hreflang)}
		<link rel="alternate" hreflang={alternate.hreflang} href={alternate.href} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={data.seo.xDefault} />
</svelte:head>

<main class="grid min-h-svh bg-background lg:grid-cols-2">
	<section class="relative flex min-h-svh flex-col px-6 py-8 sm:px-10 lg:px-14 lg:py-10">
		<a
			href={resolve(localizeHref('/') as '/')}
			class="inline-flex w-fit items-center gap-3 text-base font-semibold tracking-tight text-foreground"
		>
			<span
				class="grid size-9 place-items-center rounded-lg bg-foreground text-background shadow-sm"
			>
				<Sparkles aria-hidden="true" class="size-5" />
			</span>
			{m['brand.name']()}
		</a>

		<div class="my-auto w-full max-w-md self-center py-12">
			<header class="mb-9">
				<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{m['login.title']()}</h1>
				<p class="mt-3 text-base text-muted-foreground">{m['login.description']()}</p>
			</header>

			{#if data.sessionExpired}
				<p
					class="mb-6 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-foreground"
					role="status"
				>
					{m['login.sessionExpired']()}
				</p>
			{/if}

			{#if $errors._errors?.length}
				<div
					id="login-form-error"
					class="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
					role="alert"
				>
					{#each $errors._errors as error (error)}
						<p>{error}</p>
					{/each}
				</div>
			{/if}

			<form method="POST" novalidate aria-describedby="login-form-error" {@attach enhanceForm}>
				<FormField
					label={m['login.email']()}
					error={$errors.email?.[0]}
					errorId="login-email-error"
				>
					<Input
						class="min-h-12 px-4"
						name="email"
						type="email"
						placeholder={m['login.emailPlaceholder']()}
						autocomplete="email"
						required
						bind:value={$form.email}
						aria-invalid={$errors.email?.length ? 'true' : undefined}
						aria-describedby={$errors.email?.length ? 'login-email-error' : undefined}
					/>
				</FormField>

				<FormField
					label={m['login.password']()}
					error={$errors.password?.[0]}
					errorId="login-password-error"
				>
					<Input
						class="min-h-12 px-4"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={$form.password}
						aria-invalid={$errors.password?.length ? 'true' : undefined}
						aria-describedby={$errors.password?.length ? 'login-password-error' : undefined}
					/>
				</FormField>

				<Button type="submit" class="mt-2 h-12 w-full" disabled={$submitting}>
					{#if $submitting}<DelayedLoading><LoadingSpinner /></DelayedLoading>{/if}
					{$submitting ? m['login.submitting']() : m['login.submit']()}
				</Button>
			</form>

			<Button
				href={resolve(localizeHref('/') as '/')}
				variant="ghost"
				class="mx-auto mt-5 flex w-fit"
			>
				<ArrowLeft aria-hidden="true" class="size-4" />
				{m['login.backHome']()}
			</Button>
		</div>
	</section>

	<aside
		class="relative hidden min-h-svh overflow-hidden border-l border-border bg-muted lg:grid lg:place-items-center"
		aria-hidden="true"
	>
		<div class="absolute size-[34rem] rotate-45 border border-border/70"></div>
		<div class="absolute size-[25rem] rounded-full border border-border/80"></div>
		<div class="absolute h-px w-[34rem] bg-border/80"></div>
		<div class="absolute h-[34rem] w-px bg-border/80"></div>
		<div class="absolute size-48 rounded-full border border-border bg-muted shadow-sm"></div>
		<div
			class="relative grid size-24 place-items-center rounded-full border border-border bg-background/40 shadow-sm backdrop-blur-sm"
		>
			<ChartNoAxesCombined class="size-9 text-muted-foreground" strokeWidth={1.5} />
		</div>
	</aside>
</main>
