import { getCampaignSummary } from '$lib/server/campaigns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	summary: getCampaignSummary()
});
