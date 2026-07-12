import { getLocale } from '$lib/paraglide/runtime.js';
import { campaignQuerySchema, queryForCampaignRoute } from '$lib/campaigns/query';
import { getCampaignPage } from '$lib/server/campaigns';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const formData = await superValidate(url, zod4(campaignQuerySchema));
	const query = queryForCampaignRoute(formData.data);

	return {
		formData,
		query,
		campaignsPage: getCampaignPage(query, getLocale())
	};
};
