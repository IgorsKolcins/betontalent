import { describe, expect, it } from 'vitest';
import {
	campaignQuerySchema,
	createCampaignQueryParams,
	decodeCampaignQuery,
	nextCampaignSort,
	splitCampaignSort
} from './query';

describe('campaign URL state codec', () => {
	it('normalizes each invalid URL field without discarding valid filters', () => {
		const params = new URLSearchParams({
			q: '  launch  ',
			status: 'not-a-status',
			channel: 'email',
			sort: 'not-a-sort',
			page: '0'
		});

		expect(decodeCampaignQuery(params)).toEqual({
			q: 'launch',
			status: '',
			channel: 'email',
			sort: 'startDate-desc',
			page: 1
		});
	});

	it('decodes URL values into normalized campaign state', () => {
		const params = new URLSearchParams({
			q: '  launch  ',
			status: 'active',
			channel: 'email',
			sort: 'budget-asc',
			page: '3'
		});

		expect(decodeCampaignQuery(params)).toEqual({
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

	it('accepts start date sorting and rejects the removed updated-at option', () => {
		expect(decodeCampaignQuery(new URLSearchParams('sort=startDate-asc')).sort).toBe(
			'startDate-asc'
		);
		expect(decodeCampaignQuery(new URLSearchParams('sort=updatedAt-desc')).sort).toBe(
			'startDate-desc'
		);
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

	it('cycles a column through both directions and back to the table default', () => {
		expect(nextCampaignSort('startDate-desc', 'name')).toBe('name-asc');
		expect(nextCampaignSort('name-asc', 'name')).toBe('name-desc');
		expect(nextCampaignSort('name-desc', 'name')).toBe('startDate-desc');
	});
});
