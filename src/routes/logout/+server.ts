import { localizeHref } from '$lib/paraglide/runtime.js';
import { clearSession } from '$lib/server/auth/session';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ cookies }) => {
	clearSession(cookies);
	redirect(303, localizeHref('/login'));
};
