<script lang="ts">
	import { resolve } from '$app/paths';
	import { untrack } from 'svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
	import {
		CAMPAIGN_CHANNELS,
		CAMPAIGN_STATUSES,
		MAX_CAMPAIGN_QUERY_LENGTH,
		campaignQuerySchema,
		type CampaignQuery
	} from '$lib/campaigns/query';
	import FormField from '$lib/components/ui/FormField.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	let { formData }: { formData: SuperValidated<CampaignQuery> } = $props();

	const { errors, form, validateForm } = superForm(
		untrack(() => formData),
		{
			validators: zod4Client(campaignQuerySchema),
			validationMethod: 'submit-only',
			resetForm: false
		}
	);
	let isSubmitting = $state(false);
	const itemsHref = resolve(localizeHref('/dashboard/items') as '/dashboard/items');
	const queryError = $derived($errors.q?.[0]);
	const clearHref = $derived(
		resolve(localizeHref(`/dashboard/items?sort=${$form.sort}`) as '/dashboard/items')
	);

	function requestSubmit(event: Event & { currentTarget: HTMLSelectElement }) {
		event.currentTarget.form?.requestSubmit();
	}

	async function submitForm(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
		event.preventDefault();
		const formElement = event.currentTarget;
		isSubmitting = true;

		const validation = await validateForm({ update: true, focusOnError: true });
		if (validation.valid) {
			formElement.submit();
		} else {
			isSubmitting = false;
		}
	}
</script>

<form
	method="GET"
	action={itemsHref}
	onsubmit={submitForm}
	class="grid gap-4 rounded-lg border border-border bg-card p-4 shadow-sm md:grid-cols-[minmax(14rem,1fr)_minmax(10rem,14rem)_minmax(10rem,14rem)_auto]"
>
	<FormField
		label={m['dashboard.items.filters.nameLabel']()}
		error={queryError
			? m['dashboard.items.filters.nameMaxError']({ max: MAX_CAMPAIGN_QUERY_LENGTH })
			: undefined}
	>
		<SearchInput
			name="q"
			placeholder={m['dashboard.items.filters.namePlaceholder']()}
			bind:value={$form.q}
			maxlength={MAX_CAMPAIGN_QUERY_LENGTH}
			aria-invalid={queryError ? 'true' : undefined}
			clearLabel={m['dashboard.items.filters.clearName']()}
			submitLabel={m['dashboard.items.filters.apply']()}
			loading={isSubmitting}
		/>
	</FormField>

	<FormField label={m['dashboard.items.filters.statusLabel']()}>
		<Select
			name="status"
			bind:value={$form.status}
			onchange={requestSubmit}
			disabled={isSubmitting}
		>
			<option value="">{m['dashboard.items.filters.allStatuses']()}</option>
			{#each CAMPAIGN_STATUSES as status (status)}
				<option value={status}>{m[`campaign.status.${status}`]()}</option>
			{/each}
		</Select>
	</FormField>

	<FormField label={m['dashboard.items.filters.channelLabel']()}>
		<Select
			name="channel"
			bind:value={$form.channel}
			onchange={requestSubmit}
			disabled={isSubmitting}
		>
			<option value="">{m['dashboard.items.filters.allChannels']()}</option>
			{#each CAMPAIGN_CHANNELS as channel (channel)}
				<option value={channel}>{m[`campaign.channel.${channel}`]()}</option>
			{/each}
		</Select>
	</FormField>

	<div class="flex items-end pb-6">
		<a
			href={clearHref}
			class="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-border bg-secondary px-4 text-sm font-semibold text-secondary-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
		>
			{m['filters.clear']()}
		</a>
	</div>

	<input type="hidden" name="sort" value={$form.sort} />
	<input type="hidden" name="page" value="1" />
</form>
