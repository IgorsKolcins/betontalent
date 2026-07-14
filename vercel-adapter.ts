import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import vercel from '@sveltejs/adapter-vercel';
import type { Adapter } from '@sveltejs/kit';

interface VercelRoute {
	src?: string;
	dest?: string;
	[key: string]: unknown;
}

interface VercelOutputConfig {
	routes: VercelRoute[];
	[key: string]: unknown;
}

const outputConfigPath = path.resolve('.vercel/output/config.json');

function escapeRegex(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isLocalizedApplicationRoute(route: VercelRoute) {
	return (
		route.src?.startsWith('^/') === true &&
		route.dest !== undefined &&
		!route.dest.startsWith('/api/') &&
		route.dest !== '/sitemap.xml'
	);
}

function addLocalizedRouteAliases(routes: VercelRoute[], locales: readonly string[]) {
	const localePattern = locales.map(escapeRegex).join('|');

	return routes.flatMap((route) => {
		if (!isLocalizedApplicationRoute(route)) return [route];

		return [
			{
				...route,
				src: `^/(?:${localePattern})${route.src?.slice(1)}`
			},
			route
		];
	});
}

async function addLocalizedRoutesToVercelOutput(locales: readonly string[]) {
	const output = JSON.parse(await readFile(outputConfigPath, 'utf8')) as VercelOutputConfig;
	output.routes = addLocalizedRouteAliases(output.routes, locales);
	await writeFile(outputConfigPath, `${JSON.stringify(output, null, '\t')}\n`);
}

/**
 * Vercel selects a runtime-specific function before SvelteKit's reroute hook runs.
 * These aliases send locale-prefixed URLs to the same function as their canonical route.
 */
export function localizedVercelAdapter(locales: readonly string[]): Adapter {
	const adapter = vercel();

	return {
		...adapter,
		async adapt(builder) {
			await adapter.adapt(builder);
			await addLocalizedRoutesToVercelOutput(locales);
		}
	};
}
