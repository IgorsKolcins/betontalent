import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('an authenticated editor sees an accessible dashboard and a failed optimistic edit rolls back', async ({
	page
}) => {
	await page.goto('/en/login');
	await page.getByLabel('Email').fill('editor@demo.test');
	await page.getByLabel('Password').fill('demo1234');
	await page.getByRole('button', { name: 'Sign in' }).click();

	await expect(page).toHaveURL(/\/en\/dashboard$/);
	await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();

	const accessibility = await new AxeBuilder({ page }).analyze();
	const seriousOrCritical = accessibility.violations.filter(
		(violation) => violation.impact === 'serious' || violation.impact === 'critical'
	);
	expect(seriousOrCritical, JSON.stringify(seriousOrCritical, null, 2)).toEqual([]);

	await page.getByRole('link', { name: 'Campaigns' }).first().click();
	await expect(page).toHaveURL(/\/en\/dashboard\/items$/);

	const campaignName = 'Autumn — Beta program #213';
	const status = page.getByRole('combobox', { name: `Edit status for ${campaignName}` });
	await expect(status).toHaveValue('active');

	let requestBody: unknown;
	await page.route('**/api/campaigns/*/status', async (route) => {
		requestBody = route.request().postDataJSON();
		await new Promise((resolve) => setTimeout(resolve, 400));
		await route.fulfill({
			status: 500,
			contentType: 'application/json',
			body: JSON.stringify({ message: 'Controlled failure' })
		});
	});

	await status.selectOption('completed');
	await expect(status).toHaveValue('completed');
	await expect(
		page.getByRole('status', { name: `Saving status for ${campaignName}` })
	).toBeVisible();

	await expect(page.getByRole('alert')).toContainText('The previous status was restored.');
	await expect(status).toHaveValue('active');
	expect(requestBody).toEqual({ status: 'completed' });
});
