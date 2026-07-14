import { page } from 'vitest/browser';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CampaignStatusEditor from './CampaignStatusEditor.svelte';

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('CampaignStatusEditor', () => {
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
