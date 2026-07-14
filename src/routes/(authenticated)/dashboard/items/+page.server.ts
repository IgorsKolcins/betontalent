import { getLocale } from '$lib/paraglide/runtime.js';
import { decodeCampaignQuery } from '$lib/campaigns/query';
import { getCampaignPage } from '$lib/server/campaigns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, url }) => {
	depends('app:campaigns');
	const query = decodeCampaignQuery(url.searchParams);

	return {
		query,
		campaignsPage: getCampaignPage(query, getLocale())
	};
};
