import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('switches URL, document language, UI copy, and localized posts together', async ({ page }) => {
	await page.goto('/en/blog?sort=publishedAt-desc');

	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Writing');
	await expect(page.getByText('Sub-second LCP on a content site')).toBeVisible();

	await page.getByRole('button', { name: 'Open navigation menu' }).click();
	await page.getByRole('link', { name: 'Switch language to DE' }).click();

	await expect(page).toHaveURL('/de/blog?sort=publishedAt-desc');
	await expect(page.locator('html')).toHaveAttribute('lang', 'de');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Texte');
	await expect(page.getByText('LCP unter einer Sekunde auf einer Content-Seite')).toBeVisible();
});
