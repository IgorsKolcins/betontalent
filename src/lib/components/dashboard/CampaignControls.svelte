<script lang="ts">
	import { resolve } from '$app/paths';
	import { navigating } from '$app/state';
	import { deLocalizeHref, localizeHref } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
	import {
		CAMPAIGN_CHANNELS,
		CAMPAIGN_STATUSES,
		MAX_CAMPAIGN_QUERY_LENGTH,
		type CampaignQuery
	} from '$lib/campaigns/query';
	import FormField from '$lib/components/ui/FormField.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	let { query }: { query: CampaignQuery } = $props();

	const itemsHref = resolve(localizeHref('/dashboard/items') as '/dashboard/items');
	const clearHref = $derived(
		resolve(localizeHref(`/dashboard/items?sort=${query.sort}`) as '/dashboard/items')
	);
	const isSubmitting = $derived(
		Boolean(navigating?.to && deLocalizeHref(navigating.to.url.pathname) === '/dashboard/items')
	);

	function requestSubmit(event: Event & { currentTarget: HTMLSelectElement }) {
		event.currentTarget.form?.requestSubmit();
	}
</script>

<form
	method="GET"
	action={itemsHref}
	class="grid gap-4 rounded-lg border border-border bg-card p-4 shadow-sm md:grid-cols-[minmax(14rem,1fr)_minmax(10rem,14rem)_minmax(10rem,14rem)_auto]"
>
	<FormField label={m['dashboard.items.filters.nameLabel']()}>
		<SearchInput
			name="q"
			placeholder={m['dashboard.items.filters.namePlaceholder']()}
			value={query.q}
			maxlength={MAX_CAMPAIGN_QUERY_LENGTH}
			clearLabel={m['dashboard.items.filters.clearName']()}
			submitLabel={m['dashboard.items.filters.apply']()}
			loading={isSubmitting}
		/>
	</FormField>

	<FormField label={m['dashboard.items.filters.statusLabel']()}>
		<Select name="status" value={query.status} onchange={requestSubmit} disabled={isSubmitting}>
			<option value="">{m['dashboard.items.filters.allStatuses']()}</option>
			{#each CAMPAIGN_STATUSES as status (status)}
				<option value={status}>{m[`campaign.status.${status}`]()}</option>
			{/each}
		</Select>
	</FormField>

	<FormField label={m['dashboard.items.filters.channelLabel']()}>
		<Select name="channel" value={query.channel} onchange={requestSubmit} disabled={isSubmitting}>
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

	<input type="hidden" name="sort" value={query.sort} />
	<input type="hidden" name="page" value="1" />
</form>
