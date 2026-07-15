import type { CampaignQuery } from '$lib/api/campaigns/query';
import { getCampaignPage, getCampaignTotalCount, type CampaignPage } from './campaigns';

export type CampaignMetadata = {
	totalCount: number;
};

export async function loadCampaignPage(
	query: CampaignQuery,
	locale: string
): Promise<CampaignPage> {
	return getCampaignPage(query, locale);
}

export async function loadCampaignMetadata(): Promise<CampaignMetadata> {
	return { totalCount: getCampaignTotalCount() };
}
