import process from 'node:process';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const config = {
	runtime: 'nodejs22.x'
};

export const GET: RequestHandler = () => {
	return json({
		runtime: 'node',
		nodeVersion: process.version,
		dependencyConstraint: 'Uses Node process metadata, so it stays out of the Edge bundle.'
	});
};
