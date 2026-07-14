import { getTextDirection } from '$lib/paraglide/runtime.js';
import { paraglideMiddleware } from '$lib/paraglide/server.js';
import { findUserById } from '$lib/server/auth/users';
import { clearSession, resolveSession } from '$lib/server/auth/session';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	return paraglideMiddleware(event.request, async ({ request, locale }) => {
		event.request = request;
		const session = await resolveSession(event.cookies);
		event.locals.sessionStatus = session.status;
		event.locals.user = session.status === 'valid' ? findUserById(session.userId) : null;

		if (session.status === 'valid' && !event.locals.user) {
			clearSession(event.cookies);
			event.locals.sessionStatus = 'invalid';
		}

		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale).replace('%dir%', getTextDirection(locale));
			}
		});
	});
};
