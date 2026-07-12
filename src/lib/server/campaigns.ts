import itemsJson from '../../../mocks/items.json';
import { z } from 'zod';

const campaignSchema = z.object({
	id: z.string(),
	name: z.string(),
	status: z.enum(['draft', 'scheduled', 'active', 'paused', 'completed', 'archived']),
	channel: z.enum(['email', 'sms', 'web', 'social', 'push']),
	owner: z.object({ id: z.string(), name: z.string() }),
	budget: z.number().nonnegative(),
	spent: z.number().nonnegative(),
	impressions: z.number().int().nonnegative(),
	clicks: z.number().int().nonnegative(),
	ctr: z.number().min(0).max(1),
	startDate: z.iso.date(),
	endDate: z.iso.date(),
	updatedAt: z.iso.datetime(),
	tags: z.array(z.string())
});

const campaigns = z.array(campaignSchema).parse(itemsJson);

export type Campaign = z.infer<typeof campaignSchema>;

export type CampaignSummary = {
	totalCount: number;
	activeCount: number;
	totalBudget: number;
	aggregateCtr: number;
};

export function getCampaignSummary(): CampaignSummary {
	const totals = campaigns.reduce(
		(summary, campaign) => ({
			activeCount: summary.activeCount + Number(campaign.status === 'active'),
			totalBudget: summary.totalBudget + campaign.budget,
			clicks: summary.clicks + campaign.clicks,
			impressions: summary.impressions + campaign.impressions
		}),
		{ activeCount: 0, totalBudget: 0, clicks: 0, impressions: 0 }
	);

	return {
		totalCount: campaigns.length,
		activeCount: totals.activeCount,
		totalBudget: totals.totalBudget,
		aggregateCtr: totals.impressions === 0 ? 0 : totals.clicks / totals.impressions
	};
}

export function getCampaigns(): Campaign[] {
	return campaigns;
}
