<script lang="ts">
	import { createLoginSchema } from '$lib/auth/login-schema';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card/Card.svelte';
	import CardContent from '$lib/components/ui/Card/CardContent.svelte';
	import CardDescription from '$lib/components/ui/Card/CardDescription.svelte';
	import CardHeader from '$lib/components/ui/Card/CardHeader.svelte';
	import CardTitle from '$lib/components/ui/Card/CardTitle.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { m } from '$lib/paraglide/messages.js';
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

<main class="container grid min-h-[calc(100vh-3.5rem)] place-items-center py-12">
	<Card class="w-full max-w-md">
		<CardHeader>
			<CardTitle>{m['login.title']()}</CardTitle>
			<CardDescription>{m['login.description']()}</CardDescription>
		</CardHeader>
		<CardContent>
			{#if data.sessionExpired}
				<p
					class="mb-4 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-foreground"
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

			<form
				method="POST"
				class="space-y-4"
				aria-describedby="login-form-error"
				{@attach enhanceForm}
			>
				<FormField
					label={m['login.email']()}
					error={$errors.email?.[0]}
					errorId="login-email-error"
				>
					<Input
						name="email"
						type="email"
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
						name="password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={$form.password}
						aria-invalid={$errors.password?.length ? 'true' : undefined}
						aria-describedby={$errors.password?.length ? 'login-password-error' : undefined}
					/>
				</FormField>

				<Button type="submit" class="h-10 w-full" disabled={$submitting}>
					{$submitting ? m['login.submitting']() : m['login.submit']()}
				</Button>
			</form>
		</CardContent>
	</Card>
</main>
