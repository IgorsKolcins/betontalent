import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ locals }) => {
	return json(
		{ isAuthenticated: Boolean(locals.user) },
		{ headers: { 'Cache-Control': 'private, no-store' } }
	);
};
