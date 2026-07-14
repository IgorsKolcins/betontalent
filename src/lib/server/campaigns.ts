import itemsJson from '../../../mocks/items.json';
import { z } from 'zod';
import {
	CAMPAIGNS_PER_PAGE,
	CAMPAIGN_CHANNELS,
	CAMPAIGN_STATUSES,
	type CampaignStatus,
	splitCampaignSort,
	type CampaignQuery,
	type CampaignSortField
} from '$lib/campaigns/query';

const campaignSchema = z.object({
	id: z.string(),
	name: z.string(),
	status: z.enum(CAMPAIGN_STATUSES),
	channel: z.enum(CAMPAIGN_CHANNELS),
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

export type CampaignPage = {
	campaigns: Campaign[];
	pagination: {
		page: number;
		perPage: number;
		total: number;
		totalPages: number;
		totalCount: number;
	};
};

export type CampaignSummary = {
	totalCount: number;
	activeCount: number;
	totalBudget: number;
	aggregateCtr: number;
};

export async function getCampaignSummary(): Promise<CampaignSummary> {
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

export async function getCampaignPage(query: CampaignQuery, locale: string): Promise<CampaignPage> {
	const normalizedQuery = query.q.toLocaleLowerCase(locale);
	const filteredCampaigns = campaigns.filter(
		(campaign) =>
			(!normalizedQuery || campaign.name.toLocaleLowerCase(locale).includes(normalizedQuery)) &&
			(!query.status || campaign.status === query.status) &&
			(!query.channel || campaign.channel === query.channel)
	);
	const { field, direction } = splitCampaignSort(query.sort);
	const collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
	const sortedCampaigns = [...filteredCampaigns].sort((left, right) => {
		const comparison = compareCampaigns(left, right, field, collator);

		return (direction === 'asc' ? comparison : -comparison) || left.id.localeCompare(right.id);
	});
	const total = sortedCampaigns.length;
	const totalPages = Math.max(1, Math.ceil(total / CAMPAIGNS_PER_PAGE));
	const page = Math.min(query.page, totalPages);
	const start = (page - 1) * CAMPAIGNS_PER_PAGE;

	return {
		campaigns: sortedCampaigns.slice(start, start + CAMPAIGNS_PER_PAGE),
		pagination: {
			page,
			perPage: CAMPAIGNS_PER_PAGE,
			total,
			totalPages,
			totalCount: campaigns.length
		}
	};
}

export function updateCampaignStatus(id: string, status: CampaignStatus): Campaign | null {
	const campaign = campaigns.find((candidate) => candidate.id === id);
	if (!campaign) return null;

	campaign.status = status;
	campaign.updatedAt = new Date().toISOString();
	return campaign;
}

function compareCampaigns(
	left: Campaign,
	right: Campaign,
	field: CampaignSortField,
	collator: Intl.Collator
): number {
	switch (field) {
		case 'name':
			return collator.compare(left.name, right.name);
		case 'status':
			return collator.compare(left.status, right.status);
		case 'channel':
			return collator.compare(left.channel, right.channel);
		case 'owner':
			return collator.compare(left.owner.name, right.owner.name);
		case 'budget':
		case 'spent':
		case 'ctr':
			return left[field] - right[field];
		case 'startDate':
			return left.startDate.localeCompare(right.startDate);
	}
}
