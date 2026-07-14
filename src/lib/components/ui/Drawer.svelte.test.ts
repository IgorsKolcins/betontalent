import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import DrawerTestHarness from './DrawerTestHarness.svelte';

describe('Drawer', () => {
	it('dismisses with Escape and restores focus to its trigger', async () => {
		render(DrawerTestHarness);
		const trigger = page.getByRole('button', { name: 'Open navigation menu' });

		await trigger.click();
		await expect.element(page.getByRole('dialog', { name: 'Primary navigation' })).toBeVisible();
		await expect.element(page.getByRole('link', { name: 'Blog' })).toBeVisible();

		await userEvent.keyboard('{Escape}');

		await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect.element(trigger).toHaveFocus();
	});
});
