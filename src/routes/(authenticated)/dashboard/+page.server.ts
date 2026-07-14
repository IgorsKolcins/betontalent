import { getCampaignSummary } from '$lib/server/campaigns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ depends }) => {
	depends('app:campaigns');

	return { summary: getCampaignSummary() };
};
