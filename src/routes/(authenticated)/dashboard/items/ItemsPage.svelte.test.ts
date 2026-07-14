import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import {
	CAMPAIGNS_PER_PAGE,
	DEFAULT_CAMPAIGN_SORT,
	type CampaignQuery
} from '$lib/campaigns/query';
import type { Campaign, CampaignPage } from '$lib/server/campaigns';
import type { PageData } from './$types';
import ItemsPage from './+page.svelte';
import '../../../layout.css';

const navigationMocks = vi.hoisted(() => ({
	goto: vi.fn(),
	invalidate: vi.fn()
}));

vi.mock('$app/navigation', () => navigationMocks);

const user = {
	id: 'viewer_1',
	email: 'viewer@demo.test',
	name: 'Demo Viewer',
	role: 'viewer' as const
};

const query: CampaignQuery = {
	q: '',
	status: '',
	channel: '',
	sort: DEFAULT_CAMPAIGN_SORT,
	page: 1
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

function campaign(index: number): Campaign {
	return {
		id: `campaign_${index}`,
		name: `Campaign ${index}`,
		status: 'active',
		channel: 'email',
		owner: { id: 'owner_1', name: 'Campaign Owner' },
		budget: 10_000,
		spent: 2_500,
		impressions: 20_000,
		clicks: 500,
		ctr: 0.025,
		startDate: '2026-01-01',
		endDate: '2026-12-31',
		updatedAt: '2026-01-01T00:00:00.000Z',
		tags: []
	};
}

function campaignPage(count = CAMPAIGNS_PER_PAGE): CampaignPage {
	return {
		campaigns: Array.from({ length: count }, (_, index) => campaign(index + 1)),
		pagination: {
			page: 1,
			perPage: CAMPAIGNS_PER_PAGE,
			total: count,
			totalPages: 1,
			totalCount: count
		}
	};
}

function data(campaignsPage: Promise<CampaignPage>): PageData {
	return {
		theme: 'light',
		user,
		query,
		campaignsPage,
		campaignMetadata: Promise.resolve({
			ok: true,
			data: { totalCount: CAMPAIGNS_PER_PAGE }
		})
	};
}

describe('dashboard campaigns page', () => {
	beforeEach(() => {
		navigationMocks.invalidate.mockReset().mockResolvedValue(undefined);
	});

	it('keeps the campaign table height stable while the first page loads', async () => {
		const campaigns = deferred<CampaignPage>();
		const { container } = render(ItemsPage, { data: data(campaigns.promise) });
		const table = container.querySelector('table');
		const tableBody = container.querySelector('tbody');

		expect(table).toHaveAttribute('aria-busy', 'true');
		expect(tableBody).not.toBeNull();
		const loadingHeight = tableBody!.getBoundingClientRect().height;
		expect(loadingHeight).toBeGreaterThan(0);

		campaigns.resolve(campaignPage());
		await expect.element(page.getByText(`Campaign ${CAMPAIGNS_PER_PAGE}`)).toBeVisible();

		const loadedTableBody = container.querySelector('tbody');
		expect(loadedTableBody).not.toBeNull();
		expect(loadedTableBody!.getBoundingClientRect().height).toBe(loadingHeight);
	});

	it('explains when no campaigns exist', async () => {
		render(ItemsPage, { data: data(Promise.resolve(campaignPage(0))) });

		await expect.element(page.getByText('No campaigns yet.')).toBeVisible();
	});

	it('shows a recoverable error when campaigns cannot be loaded', async () => {
		const campaigns = deferred<CampaignPage>();
		render(ItemsPage, { data: data(campaigns.promise) });

		campaigns.reject(new Error('Campaign service unavailable'));

		await expect
			.element(page.getByRole('alert'))
			.toHaveTextContent('Campaigns could not be loaded.');
		await page.getByRole('button', { name: 'Try again' }).click();

		expect(navigationMocks.invalidate).toHaveBeenCalledWith('app:campaigns');
	});
});
