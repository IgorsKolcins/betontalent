import { expect, test } from '@playwright/test';

type BlogViewTransitionRecord = {
	direction: string;
	source?: string;
	target?: string;
	rootAnimationName?: string;
	coverAnimationDuration?: string;
};

type BlogViewTransitionWindow = Window & {
	__blogViewTransitions: BlogViewTransitionRecord[];
};

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

test('the selected cover moves into the Blog Post and back to its card', async ({ page }) => {
	await page.addInitScript(() => {
		const transitions: BlogViewTransitionRecord[] = [];
		const startViewTransition = document.startViewTransition.bind(document);
		const getNamedCover = () =>
			Array.from(document.querySelectorAll<HTMLElement>('[data-blog-cover]')).find(
				(cover) => cover.style.viewTransitionName === 'blog-post-cover'
			)?.dataset.blogCover;
		Object.defineProperty(window, '__blogViewTransitions', { value: transitions });

		document.startViewTransition = (updateCallback) => {
			const record = {
				direction: document.documentElement.dataset.blogTransition ?? '',
				source: getNamedCover()
			};
			transitions.push(record);
			const transition = startViewTransition(updateCallback);
			void transition.ready.then(() => {
				record.target = getNamedCover();
				record.rootAnimationName = getComputedStyle(
					document.documentElement,
					'::view-transition-old(root)'
				).animationName;
				record.coverAnimationDuration = getComputedStyle(
					document.documentElement,
					'::view-transition-group(blog-post-cover)'
				).animationDuration;
			});
			return transition;
		};
	});

	await page.goto('/en/search?q=Sub-second+LCP');
	await page.waitForLoadState('networkidle');
	await page.getByRole('link', { name: 'Read Sub-second LCP on a content site' }).click();
	await expect
		.poll(() => page.evaluate(() => (window as BlogViewTransitionWindow).__blogViewTransitions))
		.toEqual([
			{
				coverAnimationDuration: '0.42s',
				direction: 'forward',
				rootAnimationName: 'none',
				source: 'sub-second-lcp-on-a-content-site',
				target: 'sub-second-lcp-on-a-content-site'
			}
		]);
	await expect(
		page.getByRole('heading', { level: 1, name: 'Sub-second LCP on a content site' })
	).toBeVisible();

	await page.goBack();
	await expect(page.getByRole('heading', { level: 1, name: 'Search' })).toBeVisible();
	await expect
		.poll(() => page.evaluate(() => (window as BlogViewTransitionWindow).__blogViewTransitions))
		.toEqual([
			{
				coverAnimationDuration: '0.42s',
				direction: 'forward',
				rootAnimationName: 'none',
				source: 'sub-second-lcp-on-a-content-site',
				target: 'sub-second-lcp-on-a-content-site'
			},
			{
				coverAnimationDuration: '0.42s',
				direction: 'backward',
				rootAnimationName: 'none',
				source: 'sub-second-lcp-on-a-content-site',
				target: 'sub-second-lcp-on-a-content-site'
			}
		]);
});

test('invalid search fields fall back independently from valid URL state', async ({ page }) => {
	await page.goto('/en/search?q=Sub-second+LCP&sort=invalid&page=0');

	await expect(page.getByRole('searchbox', { name: 'Query' })).toHaveValue('Sub-second LCP');
	await expect(page.getByRole('combobox', { name: 'Sort by' })).toHaveValue('publishedAt-desc');
	await expect(page.getByText('1 results for "Sub-second LCP"')).toBeVisible();
});
