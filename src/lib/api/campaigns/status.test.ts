import { describe, expect, it, vi } from 'vitest';
import { updateCampaignStatus } from './status';

describe('updateCampaignStatus', () => {
	it('returns the validated campaign update', async () => {
		const fetcher = vi.fn().mockResolvedValue(
			Response.json({
				campaign: {
					id: 'campaign_1',
					status: 'completed',
					updatedAt: '2026-07-14T10:00:00.000Z'
				}
			})
		);

		await expect(updateCampaignStatus(fetcher, 'campaign_1', 'completed')).resolves.toEqual({
			ok: true,
			campaign: {
				id: 'campaign_1',
				status: 'completed',
				updatedAt: '2026-07-14T10:00:00.000Z'
			}
		});
	});

	it.each([
		[401, 'unauthenticated'],
		[403, 'forbidden'],
		[400, 'validation'],
		[404, 'not-found'],
		[500, 'server']
	] as const)('maps an HTTP %s response to %s', async (status, reason) => {
		const fetcher = vi.fn().mockResolvedValue(new Response(null, { status }));

		await expect(updateCampaignStatus(fetcher, 'campaign_1', 'completed')).resolves.toEqual({
			ok: false,
			reason
		});
	});

	it('distinguishes a network failure from response failures', async () => {
		const fetcher = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

		await expect(updateCampaignStatus(fetcher, 'campaign_1', 'completed')).resolves.toEqual({
			ok: false,
			reason: 'network'
		});
	});
});
