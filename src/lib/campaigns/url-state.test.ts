import { describe, expect, it } from 'vitest';
import {
	campaignQuerySchema,
	createCampaignQueryParams,
	queryForCampaignRoute,
	splitCampaignSort
} from './query';

describe('campaign URL state codec', () => {
	it('decodes URL values into normalized campaign state', () => {
		const query = campaignQuerySchema.parse({
			q: '  launch  ',
			status: 'active',
			channel: 'email',
			sort: 'budget-asc',
			page: '3'
		});

		expect(queryForCampaignRoute(query)).toEqual({
			q: 'launch',
			status: 'active',
			channel: 'email',
			sort: 'budget-asc',
			page: 3
		});
	});

	it('encodes meaningful filters while omitting default state', () => {
		const query = campaignQuerySchema.parse({ q: 'launch', status: 'active' });

		expect(createCampaignQueryParams(query)).toBe('q=launch&status=active');
	});

	it('preserves filters and sort while resetting pagination after a control change', () => {
		const query = campaignQuerySchema.parse({
			q: 'summer',
			channel: 'social',
			sort: 'name-asc',
			page: 4
		});

		expect(createCampaignQueryParams(query, 1)).toBe('q=summer&channel=social&sort=name-asc');
		expect(splitCampaignSort(query.sort)).toEqual({ field: 'name', direction: 'asc' });
	});
});
