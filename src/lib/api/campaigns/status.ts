import { z } from 'zod';
import { campaignStatusSchema, type CampaignStatus } from '$lib/campaigns/query';
import type { ApiFetch } from '$lib/api/client';

const campaignStatusUpdateSchema = z.object({
	campaign: z.object({
		id: z.string().min(1),
		status: campaignStatusSchema,
		updatedAt: z.iso.datetime()
	})
});

type CampaignStatusUpdate = z.infer<typeof campaignStatusUpdateSchema>['campaign'];

export type CampaignStatusUpdateFailure =
	'unauthenticated' | 'forbidden' | 'validation' | 'not-found' | 'network' | 'server';

export type CampaignStatusUpdateResult =
	{ ok: true; campaign: CampaignStatusUpdate } | { ok: false; reason: CampaignStatusUpdateFailure };

export async function updateCampaignStatus(
	fetcher: ApiFetch,
	id: string,
	status: CampaignStatus
): Promise<CampaignStatusUpdateResult> {
	let response: Response;

	try {
		response = await fetcher(`/api/campaigns/${encodeURIComponent(id)}/status`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status })
		});
	} catch {
		return { ok: false, reason: 'network' };
	}

	if (!response.ok) {
		return { ok: false, reason: failureReason(response.status) };
	}

	const parsed = campaignStatusUpdateSchema.safeParse(await response.json().catch(() => null));
	return parsed.success
		? { ok: true, campaign: parsed.data.campaign }
		: { ok: false, reason: 'server' };
}

function failureReason(status: number): CampaignStatusUpdateFailure {
	if (status === 401) return 'unauthenticated';
	if (status === 403) return 'forbidden';
	if (status === 400) return 'validation';
	if (status === 404) return 'not-found';
	return 'server';
}
