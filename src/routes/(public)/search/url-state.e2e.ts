import { expect, test } from '@playwright/test';

test('keeps controls synchronized with URL navigation and resets pagination on changes', async ({
	page
}) => {
	await page.goto('/en/search?q=edge&tag=engineering&sort=title-asc&page=2');

	const query = page.getByRole('searchbox', { name: 'Query' });
	const tag = page.getByRole('combobox', { name: 'Tag' });
	const sort = page.getByRole('combobox', { name: 'Sort by' });

	await expect(query).toHaveValue('edge');
	await expect(tag).toHaveValue('engineering');
	await expect(sort).toHaveValue('title-asc');

	await sort.selectOption('publishedAt-asc');
	await expect(page).toHaveURL('/en/search?q=edge&tag=engineering&sort=publishedAt-asc&page=1');

	await page.goBack();
	await expect(page).toHaveURL('/en/search?q=edge&tag=engineering&sort=title-asc&page=2');
	await expect(query).toHaveValue('edge');
	await expect(tag).toHaveValue('engineering');
	await expect(sort).toHaveValue('title-asc');

	await page.getByRole('link', { name: 'Clear', exact: true }).click();
	await expect(page).toHaveURL('/en/search');
});
