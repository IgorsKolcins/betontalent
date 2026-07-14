import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import type { CampaignSummary } from '$lib/server/campaigns';
import type { PageData } from './$types';
import DashboardPage from './+page.svelte';
import '../../layout.css';

const user = {
	id: 'viewer_1',
	email: 'viewer@demo.test',
	name: 'Demo Viewer',
	role: 'viewer' as const
};

function deferred<T>() {
	let resolve!: (value: T) => void;
	let reject!: (reason?: unknown) => void;
	const promise = new Promise<T>((resolvePromise, rejectPromise) => {
		resolve = resolvePromise;
		reject = rejectPromise;
	});

	return { promise, resolve, reject };
}

function data(summary: Promise<CampaignSummary>): PageData {
	return { theme: 'light', user, summary };
}

function metricContentHeights(container: HTMLElement): number[] {
	const section = container.querySelector('#campaign-overview-title')?.parentElement;
	expect(section).not.toBeNull();

	return Array.from(section!.querySelectorAll<HTMLElement>('[data-slot="card-content"]')).map(
		(content) => content.getBoundingClientRect().height
	);
}

describe('dashboard overview', () => {
	it('keeps metric card heights stable while the summary loads', async () => {
		const summary = deferred<CampaignSummary>();
		const { container } = render(DashboardPage, { data: data(summary.promise) });
		const loadingHeights = metricContentHeights(container);

		expect(loadingHeights).toHaveLength(4);
		expect(loadingHeights.every((height) => height > 0)).toBe(true);

		summary.resolve({
			totalCount: 20,
			activeCount: 8,
			totalBudget: 125_000,
			aggregateCtr: 0.025
		});
		await expect.element(page.getByText('20', { exact: true })).toBeVisible();

		expect(metricContentHeights(container)).toEqual(loadingHeights);
	});

	it('keeps the rest of the dashboard usable when its summary fails', async () => {
		const summary = deferred<CampaignSummary>();
		const { container } = render(DashboardPage, { data: data(summary.promise) });

		summary.reject(new Error('Summary service unavailable'));

		await vi.waitFor(() => {
			expect(container.querySelectorAll('[role="alert"]')).toHaveLength(4);
		});
		await expect.element(page.getByText('Welcome back, Demo Viewer.')).toBeVisible();
		await expect.element(page.getByRole('link', { name: /Explore campaigns/ })).toBeVisible();
	});
});
