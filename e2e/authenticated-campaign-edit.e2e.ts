import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('an authenticated editor sees an accessible dashboard and campaign edits stay consistent', async ({
	page
}) => {
	// Establish an editor session and confirm the protected dashboard is reachable.
	await page.goto('/en/login');
	await page.getByLabel('Email').fill('editor@demo.test');
	await page.getByLabel('Password').fill('demo1234');
	await page.getByRole('button', { name: 'Sign in' }).click();

	await expect(page).toHaveURL(/\/en\/dashboard$/);
	await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();

	// The public navigation should recognize the session and offer Dashboard instead of Sign in.
	await page.goto('/en');
	const dashboardLink = page.getByRole('link', { name: 'Dashboard', exact: true });
	await expect(dashboardLink).toBeVisible();
	await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeHidden();
	await dashboardLink.click();
	await expect(page).toHaveURL(/\/en\/dashboard$/);

	// Keep the authenticated dashboard free of serious and critical accessibility violations.
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

	// Failure path: expose the optimistic value while the request is pending, then verify rollback.
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
	await expect(status).toBeEnabled();

	await expect(page.getByRole('alert')).toContainText('The previous status was restored.');
	await expect(status).toHaveValue('active');
	expect(requestBody).toEqual({ status: 'completed' });

	// Success path: keep the editor interactive and preserve row order after confirmation.
	await page.unroute('**/api/campaigns/*/status');
	const campaignRows = page.locator('tbody tr');
	const rowIndexBeforeUpdate = await campaignRows.evaluateAll(
		(rows, name) => rows.findIndex((row) => row.textContent?.includes(name)),
		campaignName
	);
	await page.route('**/api/campaigns/*/status', async (route) => {
		await new Promise((resolve) => setTimeout(resolve, 400));
		await route.continue();
	});

	const successfulUpdate = page.waitForResponse(
		(response) =>
			response.url().includes('/api/campaigns/') && response.request().method() === 'PUT'
	);
	await status.selectOption('completed');
	await expect(status).toHaveValue('completed');
	await expect(status).toBeEnabled();
	await successfulUpdate;
	expect(
		await campaignRows.evaluateAll(
			(rows, name) => rows.findIndex((row) => row.textContent?.includes(name)),
			campaignName
		)
	).toBe(rowIndexBeforeUpdate);

	// A confirmed edit intentionally stays optimistic in the current filtered view without invalidation.
	await page.unroute('**/api/campaigns/*/status');
	await page.goto('/en/dashboard/items?q=Autumn+%E2%80%94+Beta+program+%23213&status=completed');
	const filteredStatus = page.getByRole('combobox', { name: `Edit status for ${campaignName}` });
	await expect(filteredStatus).toHaveValue('completed');
	await page.route('**/api/campaigns/*/status', async (route) => {
		await new Promise((resolve) => setTimeout(resolve, 400));
		await route.continue();
	});

	const filteredUpdate = page.waitForResponse(
		(response) =>
			response.url().includes('/api/campaigns/') && response.request().method() === 'PUT'
	);
	await filteredStatus.selectOption('active');
	await expect(filteredStatus).toHaveValue('active');
	await expect(filteredStatus).toBeEnabled();
	await filteredUpdate;

	await expect(filteredStatus).toHaveValue('active');
	await expect(page.getByText('No campaigns match these filters.')).toHaveCount(0);
	await expect(page).toHaveURL(/q=Autumn.*status=completed/);

	// Refreshing reloads authoritative server data, so the completed filter then excludes this campaign.
	await page.reload();
	await expect(page.getByText('No campaigns match these filters.')).toBeVisible();
});
