import { createLoginSchema } from '$lib/auth/login-schema';
import { safeDashboardReturnTo } from '$lib/auth/redirect';
import { m } from '$lib/paraglide/messages.js';
import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
import { createSession } from '$lib/server/auth/session';
import { authenticateUser } from '$lib/server/auth/users';
import { getLocaleSeo } from '$lib/seo';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

function loginSchema() {
	return createLoginSchema({
		invalidEmail: m['login.validation.email'](),
		passwordRequired: m['login.validation.password']()
	});
}

function dashboardDestination(returnTo: string | null) {
	return safeDashboardReturnTo(returnTo) ?? localizeHref('/dashboard');
}

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) redirect(303, dashboardDestination(url.searchParams.get('returnTo')));

	return {
		form: await superValidate(zod4(loginSchema())),
		sessionExpired: url.searchParams.get('reason') === 'expired',
		seo: getLocaleSeo(url.origin, getLocale(), '/login')
	};
};

export const actions: Actions = {
	default: async ({ cookies, request, url }) => {
		const form = await superValidate(request, zod4(loginSchema()));
		if (!form.valid) return fail(400, { form });

		const user = authenticateUser(form.data);
		if (!user) {
			form.data.password = '';
			return setError(form, '', m['login.error'](), { status: 401 });
		}

		await createSession(cookies, user.id);
		redirect(303, dashboardDestination(url.searchParams.get('returnTo')));
	}
};
