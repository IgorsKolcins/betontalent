import { page } from 'vitest/browser';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CampaignStatusEditor from './CampaignStatusEditor.svelte';

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('CampaignStatusEditor', () => {
	it('keeps the select interactive and sends rapid changes in order', async () => {
		const responses: Array<(response: Response) => void> = [];
		const fetchMock = vi.fn().mockImplementation(
			() =>
				new Promise<Response>((resolve) => {
					responses.push(resolve);
				})
		);
		vi.stubGlobal('fetch', fetchMock);
		render(CampaignStatusEditor, {
			campaignId: 'campaign_1',
			campaignName: 'Launch campaign',
			status: 'active'
		});
		const status = page.getByRole('combobox', { name: 'Edit status for Launch campaign' });

		await status.selectOptions('completed');
		await expect.element(status).toBeEnabled();
		await status.selectOptions('paused');

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({
			status: 'completed'
		});

		responses[0]?.(
			Response.json({
				campaign: {
					id: 'campaign_1',
					status: 'completed',
					updatedAt: '2026-07-15T12:00:00.000Z'
				}
			})
		);

		await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
		expect(JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body))).toEqual({ status: 'paused' });
	});

	it('restores the previous status and explains a forbidden update', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 403 })));
		render(CampaignStatusEditor, {
			campaignId: 'campaign_1',
			campaignName: 'Launch campaign',
			status: 'active'
		});
		const status = page.getByRole('combobox', { name: 'Edit status for Launch campaign' });

		await status.selectOptions('completed');

		await expect.element(status).toHaveValue('active');
		await expect
			.element(page.getByRole('alert'))
			.toHaveTextContent('You do not have permission to edit campaigns.');
	});
});
