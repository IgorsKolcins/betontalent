import { z } from 'zod';

export const CAMPAIGN_STATUSES = [
	'draft',
	'scheduled',
	'active',
	'paused',
	'completed',
	'archived'
] as const;
export const CAMPAIGN_CHANNELS = ['email', 'sms', 'web', 'social', 'push'] as const;
export const CAMPAIGN_SORT_FIELDS = [
	'name',
	'status',
	'channel',
	'owner',
	'budget',
	'spent',
	'ctr',
	'startDate'
] as const;
export const CAMPAIGN_SORT_DIRECTIONS = ['asc', 'desc'] as const;
export const CAMPAIGNS_PER_PAGE = 20;
export const MAX_CAMPAIGN_QUERY_LENGTH = 120;
export const DEFAULT_CAMPAIGN_SORT = 'startDate-desc';

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];
export type CampaignChannel = (typeof CAMPAIGN_CHANNELS)[number];
export type CampaignSortField = (typeof CAMPAIGN_SORT_FIELDS)[number];
export type CampaignSortDirection = (typeof CAMPAIGN_SORT_DIRECTIONS)[number];
export type CampaignSort = `${CampaignSortField}-${CampaignSortDirection}`;

const campaignSortOptions = CAMPAIGN_SORT_FIELDS.flatMap((field) =>
	CAMPAIGN_SORT_DIRECTIONS.map((direction) => `${field}-${direction}` as CampaignSort)
);
export const campaignStatusSchema = z.enum(CAMPAIGN_STATUSES);
const campaignStatusFilterSchema = campaignStatusSchema.or(z.literal(''));
const campaignChannelFilterSchema = z.enum(CAMPAIGN_CHANNELS).or(z.literal(''));
const campaignSortSchema = z.enum(campaignSortOptions);
const campaignPageSchema = z.coerce.number().int().min(1);

export const campaignQuerySchema = z.object({
	q: z.string().trim().max(MAX_CAMPAIGN_QUERY_LENGTH).default(''),
	status: campaignStatusFilterSchema.default(''),
	channel: campaignChannelFilterSchema.default(''),
	sort: campaignSortSchema.default(DEFAULT_CAMPAIGN_SORT),
	page: campaignPageSchema.default(1)
});

export type CampaignQuery = z.infer<typeof campaignQuerySchema>;

export function decodeCampaignQuery(searchParams: URLSearchParams): CampaignQuery {
	const q = campaignQuerySchema.shape.q.safeParse(searchParams.get('q') ?? undefined);
	const status = campaignQuerySchema.shape.status.safeParse(
		searchParams.get('status') ?? undefined
	);
	const channel = campaignQuerySchema.shape.channel.safeParse(
		searchParams.get('channel') ?? undefined
	);
	const sort = campaignQuerySchema.shape.sort.safeParse(searchParams.get('sort') ?? undefined);
	const page = campaignQuerySchema.shape.page.safeParse(searchParams.get('page') ?? undefined);

	return {
		q: q.success ? q.data : '',
		status: status.success ? status.data : '',
		channel: channel.success ? channel.data : '',
		sort: sort.success ? sort.data : DEFAULT_CAMPAIGN_SORT,
		page: page.success ? page.data : 1
	};
}

export function createCampaignQueryParams(query: CampaignQuery, page = query.page): string {
	const params = new URLSearchParams();

	if (query.q) params.set('q', query.q);
	if (query.status) params.set('status', query.status);
	if (query.channel) params.set('channel', query.channel);
	if (query.sort !== DEFAULT_CAMPAIGN_SORT) params.set('sort', query.sort);
	if (page > 1) params.set('page', String(page));

	return params.toString();
}

export function splitCampaignSort(sort: CampaignSort): {
	field: CampaignSortField;
	direction: CampaignSortDirection;
} {
	const separator = sort.lastIndexOf('-');

	return {
		field: sort.slice(0, separator) as CampaignSortField,
		direction: sort.slice(separator + 1) as CampaignSortDirection
	};
}
