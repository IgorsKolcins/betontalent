import { getLocale } from '$lib/paraglide/runtime.js';
import { decodeCampaignQuery } from '$lib/campaigns/query';
import { loadCampaignMetadata, loadCampaignPage } from '$lib/server/campaign-repository';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, url }) => {
	depends('app:campaigns');
	const query = decodeCampaignQuery(url.searchParams);
	const campaignMetadata = loadCampaignMetadata().then(
		(data) => ({ ok: true as const, data }),
		() => ({ ok: false as const })
	);

	return {
		query,
		campaignsPage: loadCampaignPage(query, getLocale()),
		campaignMetadata
	};
};
