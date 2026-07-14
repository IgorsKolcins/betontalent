import { campaignStatusSchema } from '$lib/campaigns/query';
import { canEditItems } from '$lib/server/auth/users';
import { updateCampaignStatus } from '$lib/server/campaigns';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

const requestSchema = z.object({ status: campaignStatusSchema });

export const PUT: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.user) error(401, 'Authentication required');
	if (!canEditItems(locals.user)) error(403, 'Campaign editing is not allowed');

	const parsed = requestSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) error(400, 'Invalid campaign status');

	const campaign = updateCampaignStatus(params.id, parsed.data.status);
	if (!campaign) error(404, 'Campaign not found');

	return json(
		{ campaign },
		{
			headers: { 'Cache-Control': 'private, no-store' }
		}
	);
};
