<script lang="ts">
	import { untrack } from 'svelte';
	import {
		updateCampaignStatus,
		type CampaignStatusUpdateFailure
	} from '$lib/api/campaigns/status';
	import { CAMPAIGN_STATUSES, type CampaignStatus } from '$lib/api/campaigns/query';
	import { m } from '$lib/paraglide/messages.js';
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
	let errorMessage = $state('');
	let confirmedStatus = untrack(() => status);
	let isProcessing = false;
	const pendingStatuses: CampaignStatus[] = [];

	function queueStatusUpdate(): void {
		errorMessage = '';
		pendingStatuses.push(optimisticStatus);
		void processStatusQueue();
	}

	async function processStatusQueue(): Promise<void> {
		if (isProcessing) return;

		isProcessing = true;

		while (pendingStatuses.length > 0) {
			const requestedStatus = pendingStatuses.shift();
			if (!requestedStatus) continue;

			const result = await updateCampaignStatus(fetch, campaignId, requestedStatus);

			if (!result.ok) {
				errorMessage = errorMessageFor(result.reason);
				if (pendingStatuses.length === 0) optimisticStatus = confirmedStatus;
				continue;
			}

			confirmedStatus = result.campaign.status;
			if (pendingStatuses.length === 0) optimisticStatus = confirmedStatus;
			errorMessage = '';
		}

		isProcessing = false;
		if (pendingStatuses.length > 0) void processStatusQueue();
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
	<Select
		variant="ghost"
		bind:value={optimisticStatus}
		onchange={queueStatusUpdate}
		aria-label={m['dashboard.items.editStatusLabel']({ name: campaignName })}
	>
		{#each CAMPAIGN_STATUSES as option (option)}
			<option value={option}>{m[`campaign.status.${option}`]()}</option>
		{/each}
	</Select>
	{#if errorMessage}
		<p class="max-w-52 text-xs font-medium text-destructive" role="alert">{errorMessage}</p>
	{/if}
</div>
