import { z } from 'zod';

// Importing server-only i18n state here would break client use.
export type LoginValidationMessages = {
	invalidEmail: string;
	passwordRequired: string;
};

export function createLoginSchema(messages: LoginValidationMessages) {
	return z.object({
		// Email identity is case-insensitive; password is strick.
		email: z
			.string()
			.trim()
			.toLowerCase()
			.refine((email) => z.email().safeParse(email).success, messages.invalidEmail),
		password: z.string().min(1, messages.passwordRequired)
	});
}

export type LoginCredentials = z.infer<ReturnType<typeof createLoginSchema>>;
