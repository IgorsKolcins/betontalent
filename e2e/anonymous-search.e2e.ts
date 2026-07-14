import { expect, test } from '@playwright/test';

test('an anonymous visitor searches, opens a result, and reads the post', async ({ page }) => {
	await page.goto('/en/search');

	await page.getByRole('searchbox', { name: 'Query' }).fill('Sub-second LCP');
	await page.getByRole('button', { name: 'Submit search' }).click();

	await expect(page).toHaveURL(/\/en\/search\?q=Sub-second(?:\+|%20)LCP/);
	await expect(page.getByText('1 results for "Sub-second LCP"')).toBeVisible();
	await page.waitForLoadState('networkidle');
	await expect(page).toHaveScreenshot('search-results.png', {
		animations: 'disabled',
		fullPage: true
	});

	await page.getByRole('combobox', { name: 'Sort by' }).selectOption('title-asc');
	await expect(page).toHaveURL(/sort=title-asc/);
	await page.goBack();
	await expect(page).not.toHaveURL(/sort=title-asc/);
	await expect(page.getByRole('searchbox', { name: 'Query' })).toHaveValue('Sub-second LCP');
	await page.goForward();
	await expect(page).toHaveURL(/sort=title-asc/);
	await expect(page.getByRole('combobox', { name: 'Sort by' })).toHaveValue('title-asc');

	await page.getByRole('link', { name: 'Read Sub-second LCP on a content site' }).click();

	await expect(page).toHaveURL(/\/en\/blog\/sub-second-lcp-on-a-content-site/);
	await expect(
		page.getByRole('heading', { level: 1, name: 'Sub-second LCP on a content site' })
	).toBeVisible();
	await expect(page.getByText('Published by Omar Haddad')).toBeVisible();
});

test('invalid search fields fall back independently from valid URL state', async ({ page }) => {
	await page.goto('/en/search?q=Sub-second+LCP&sort=invalid&page=0');

	await expect(page.getByRole('searchbox', { name: 'Query' })).toHaveValue('Sub-second LCP');
	await expect(page.getByRole('combobox', { name: 'Sort by' })).toHaveValue('publishedAt-desc');
	await expect(page.getByText('1 results for "Sub-second LCP"')).toBeVisible();
});
