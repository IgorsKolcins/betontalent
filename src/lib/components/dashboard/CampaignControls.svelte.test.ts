import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CampaignControls from './CampaignControls.svelte';

describe('CampaignControls', () => {
	it('renders decoded filters in a native GET form', async () => {
		render(CampaignControls, {
			query: {
				q: 'launch',
				status: 'active',
				channel: 'email',
				sort: 'name-asc',
				page: 3
			}
		});

		await expect
			.element(page.getByRole('searchbox', { name: 'Campaign name' }))
			.toHaveValue('launch');
		await expect.element(page.getByRole('combobox', { name: 'Status' })).toHaveValue('active');
		await expect.element(page.getByRole('combobox', { name: 'Channel' })).toHaveValue('email');
		expect(document.querySelector('form')?.method).toBe('get');
		expect(document.querySelector<HTMLInputElement>('input[name="sort"]')?.value).toBe('name-asc');
	});
});
