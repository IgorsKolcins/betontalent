<script lang="ts">
	import { invalidate } from '$app/navigation';
	import {
		updateCampaignStatus,
		type CampaignStatusUpdateFailure
	} from '$lib/api/campaigns/status';
	import { CAMPAIGN_STATUSES, type CampaignStatus } from '$lib/campaigns/query';
	import { m } from '$lib/paraglide/messages.js';
	import DelayedLoading from '$lib/components/ui/DelayedLoading.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import Select from '$lib/components/ui/Select.svelte';

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

		const result = await updateCampaignStatus(fetch, campaignId, optimisticStatus);

		if (!result.ok) {
			optimisticStatus = previousStatus;
			errorMessage = errorMessageFor(result.reason);
			isSaving = false;
			return;
		}

		status = result.campaign.status;
		try {
			await invalidate('app:campaigns');
		} catch {
			errorMessage = m['dashboard.items.statusRefreshError']();
		} finally {
			isSaving = false;
		}
	}

	function errorMessageFor(reason: CampaignStatusUpdateFailure): string {
		switch (reason) {
			case 'unauthenticated':
				return m['dashboard.items.statusUpdateUnauthenticated']();
			case 'forbidden':
				return m['dashboard.items.error.forbidden']();
			case 'validation':
				return m['dashboard.items.statusUpdateInvalid']({ name: campaignName });
			case 'not-found':
				return m['dashboard.items.statusUpdateNotFound']({ name: campaignName });
			case 'network':
				return m['dashboard.items.statusUpdateNetwork']({ name: campaignName });
			case 'server':
				return m['dashboard.items.statusUpdateError']({ name: campaignName });
		}
	}
</script>

<div class="min-w-40 space-y-1.5">
	<div class="flex items-center gap-2">
		<Select
			variant="ghost"
			class="disabled:cursor-wait disabled:opacity-60"
			bind:value={optimisticStatus}
			onchange={updateStatus}
			disabled={isSaving}
			aria-label={m['dashboard.items.editStatusLabel']({ name: campaignName })}
			aria-busy={isSaving}
		>
			{#each CAMPAIGN_STATUSES as option (option)}
				<option value={option}>{m[`campaign.status.${option}`]()}</option>
			{/each}
		</Select>
		<span class="flex size-4 shrink-0 items-center justify-center">
			{#if isSaving}
				<DelayedLoading>
					<span
						role="status"
						aria-label={m['dashboard.items.statusSaving']({ name: campaignName })}
					>
						<LoadingSpinner />
					</span>
				</DelayedLoading>
			{/if}
		</span>
	</div>
	{#if errorMessage}
		<p class="max-w-52 text-xs font-medium text-destructive" role="alert">{errorMessage}</p>
	{/if}
</div>
