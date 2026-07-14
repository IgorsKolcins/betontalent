<script lang="ts">
	import { CAMPAIGN_STATUSES, type CampaignStatus } from '$lib/campaigns/query';
	import { m } from '$lib/paraglide/messages.js';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';

	let {
		campaignId,
		campaignName,
		status
	}: {
		campaignId: string;
		campaignName: string;
		status: CampaignStatus;
	} = $props();

	let optimisticStatus = $derived(status);
	let isSaving = $state(false);
	let errorMessage = $state('');

	async function updateStatus(): Promise<void> {
		const previousStatus = status;
		errorMessage = '';
		isSaving = true;

		try {
			const response = await fetch(`/api/campaigns/${campaignId}/status`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: optimisticStatus })
			});

			if (!response.ok) throw new Error(`Campaign update failed with status ${response.status}`);
			status = optimisticStatus;
		} catch {
			optimisticStatus = previousStatus;
			errorMessage = m['dashboard.items.statusUpdateError']({ name: campaignName });
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="min-w-40 space-y-1.5">
	<div class="flex items-center gap-2">
		<select
			class="min-h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground shadow-sm focus:border-ring focus:ring-0 focus:outline-2 focus:outline-offset-2 focus:outline-ring disabled:cursor-wait disabled:opacity-60"
			bind:value={optimisticStatus}
			onchange={updateStatus}
			disabled={isSaving}
			aria-label={m['dashboard.items.editStatusLabel']({ name: campaignName })}
			aria-busy={isSaving}
		>
			{#each CAMPAIGN_STATUSES as option (option)}
				<option value={option}>{m[`campaign.status.${option}`]()}</option>
			{/each}
		</select>
		{#if isSaving}
			<span role="status" aria-label={m['dashboard.items.statusSaving']({ name: campaignName })}>
				<LoadingSpinner />
			</span>
		{/if}
	</div>
	{#if errorMessage}
		<p class="max-w-52 text-xs font-medium text-destructive" role="alert">{errorMessage}</p>
	{/if}
</div>
