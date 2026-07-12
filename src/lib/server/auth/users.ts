import usersJson from '../../../../mocks/users.json';
import type { LoginCredentials } from '$lib/auth/login-schema';
import { z } from 'zod';

const roles = ['admin', 'editor', 'viewer'] as const;
const roleSchema = z.enum(roles);

const userSchema = z.object({
	id: z.string(),
	email: z.email(),
	password: z.string(),
	name: z.string(),
	role: roleSchema
});

// Parse supplied mock data once at the server boundary. A malformed assessment fixture
// should fail loudly during startup instead of leaking an unvalidated shape into auth.
const users = z.array(userSchema).parse(usersJson);

export type UserRole = (typeof roles)[number];
export type AuthenticatedUser = {
	id: string;
	email: string;
	name: string;
	role: UserRole;
};

function withoutPassword(user: z.infer<typeof userSchema>): AuthenticatedUser {
	// Explicit projection makes it impossible for password to enter locals/page data.
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role
	};
}

export function authenticateUser(credentials: LoginCredentials): AuthenticatedUser | null {
	// Plaintext comparison exists only because supplied demo data uses plaintext passwords.
	// Credential verification still stays server-side; production auth would verify a hash.
	const user = users.find(
		(candidate) =>
			candidate.email.toLowerCase() === credentials.email &&
			candidate.password === credentials.password
	);

	return user ? withoutPassword(user) : null;
}

export function findUserById(id: string): AuthenticatedUser | null {
	// Session stores identity only. Role/name are resolved from current trusted user data,
	// avoiding stale authorization claims inside a long-lived cookie.
	const user = users.find((candidate) => candidate.id === id);
	return user ? withoutPassword(user) : null;
}

export function canEditItems(user: AuthenticatedUser): boolean {
	// UI may use this capability to disable controls, but write actions must check it too.
	return user.role === 'admin' || user.role === 'editor';
}
