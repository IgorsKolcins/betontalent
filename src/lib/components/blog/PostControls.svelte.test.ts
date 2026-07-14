import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import PostControls from './PostControls.svelte';

describe('PostControls', () => {
	it('renders decoded search state in a native GET form', async () => {
		render(PostControls, {
			mode: 'search',
			query: {
				q: 'talent',
				tag: 'performance',
				sort: 'title-asc',
				page: 3
			},
			tags: ['performance'],
			totalCount: 1
		});

		await expect.element(page.getByRole('searchbox', { name: 'Query' })).toHaveValue('talent');
		await expect.element(page.getByRole('combobox', { name: 'Tag' })).toHaveValue('performance');
		await expect.element(page.getByRole('combobox', { name: 'Sort by' })).toHaveValue('title-asc');
		expect(document.querySelector('form')?.method).toBe('get');
	});
});
