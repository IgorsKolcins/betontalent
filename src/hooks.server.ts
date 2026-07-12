import { THEME_COOKIE_NAME, isThemeMode } from '$lib/contexts/Theme.svelte';
import { getTextDirection } from '$lib/paraglide/runtime.js';
import { paraglideMiddleware } from '$lib/paraglide/server.js';
import { findUserById } from '$lib/server/auth/users';
import { clearSession, resolveSession } from '$lib/server/auth/session';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const cookieTheme = event.cookies.get(THEME_COOKIE_NAME);
	const theme = isThemeMode(cookieTheme) ? cookieTheme : 'light';

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
				const classAttribute = theme === 'dark' ? ' class="dark"' : '';
				return html
					.replace('%lang%', locale)
					.replace('%dir%', getTextDirection(locale))
					.replace('<html', `<html${classAttribute}`);
			}
		});
	});
};
