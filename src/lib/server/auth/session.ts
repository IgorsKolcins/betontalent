import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';
import { z } from 'zod';

export const SESSION_COOKIE_NAME = 'session';
export const AUTH_HINT_COOKIE_NAME = 'auth_hint';

// Active sessions slide by one hour once half their idle window remains. The original
// issue time never changes, enforcing a hard 24-hour lifetime despite renewals.
const IDLE_LIFETIME_MS = 60 * 60 * 1000;
const RENEWAL_THRESHOLD_MS = 30 * 60 * 1000;
const ABSOLUTE_LIFETIME_MS = 24 * 60 * 60 * 1000;

const claimsSchema = z.object({
	version: z.literal(1),
	userId: z.string(),
	issuedAt: z.number().int(),
	expiresAt: z.number().int()
});

type SessionClaims = z.infer<typeof claimsSchema>;

export type SessionResolution =
	| { status: 'missing' | 'invalid' | 'expired' }
	| { status: 'valid'; userId: string; renewed: boolean };

const encoder = new TextEncoder();

function signingSecret(): string {
	const secret = env.SESSION_SECRET;
	if (!secret) throw new Error('SESSION_SECRET must be configured');
	return secret;
}

async function signingKey() {
	// Web Crypto works in both Node and edge runtimes used by this project.
	return crypto.subtle.importKey(
		'raw',
		encoder.encode(signingSecret()),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign', 'verify']
	);
}

function toBase64Url(bytes: Uint8Array): string {
	let binary = '';
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): ArrayBuffer {
	const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
	const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
	return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0)).buffer;
}

async function encodeSession(claims: SessionClaims): Promise<string> {
	// Compact signed payload, not encryption: claims contain identity/timestamps only.
	// HMAC prevents clients from changing userId or expiry without SESSION_SECRET.
	const payload = toBase64Url(encoder.encode(JSON.stringify(claims)));
	const signature = await crypto.subtle.sign('HMAC', await signingKey(), encoder.encode(payload));
	return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

async function decodeSession(value: string): Promise<SessionClaims | null> {
	// Load key outside catch so missing server configuration remains a visible 500;
	// malformed or tampered client cookies are ordinary invalid-session results.
	const key = await signingKey();
	try {
		const [payload, signature, extra] = value.split('.');
		if (!payload || !signature || extra) return null;

		const valid = await crypto.subtle.verify(
			'HMAC',
			key,
			fromBase64Url(signature),
			encoder.encode(payload)
		);
		if (!valid) return null;

		return claimsSchema.parse(JSON.parse(new TextDecoder().decode(fromBase64Url(payload))));
	} catch {
		return null;
	}
}

function setCookie(cookies: Cookies, value: string, expiresAt: number, now: number) {
	const sharedOptions = {
		sameSite: 'lax' as const,
		secure: !dev,
		path: '/',
		expires: new Date(expiresAt),
		maxAge: Math.max(0, Math.floor((expiresAt - now) / 1000))
	};

	// This readable cookie is only a display hint for prerendered navigation. It never
	// grants access; protected routes continue to verify the signed HttpOnly session.
	cookies.set(AUTH_HINT_COOKIE_NAME, '1', {
		...sharedOptions,
		httpOnly: false
	});

	// HttpOnly blocks client-side credential access; Lax retains normal navigation while
	// limiting cross-site submission. Secure is disabled only for local HTTP development.
	cookies.set(SESSION_COOKIE_NAME, value, {
		...sharedOptions,
		httpOnly: true
	});
}

export async function createSession(cookies: Cookies, userId: string, now = Date.now()) {
	// Optional clock keeps expiry boundary behavior deterministic without global fake timers.
	const claims: SessionClaims = {
		version: 1,
		userId,
		issuedAt: now,
		expiresAt: now + IDLE_LIFETIME_MS
	};
	setCookie(cookies, await encodeSession(claims), claims.expiresAt, now);
}

export async function resolveSession(
	cookies: Cookies,
	now = Date.now()
): Promise<SessionResolution> {
	const value = cookies.get(SESSION_COOKIE_NAME);
	if (!value) return { status: 'missing' };

	const claims = await decodeSession(value);
	if (!claims) {
		// Remove bad cookies immediately so every later request does not repeat verification.
		clearSession(cookies);
		return { status: 'invalid' };
	}

	const absoluteExpiry = claims.issuedAt + ABSOLUTE_LIFETIME_MS;
	if (now >= claims.expiresAt || now >= absoluteExpiry) {
		clearSession(cookies);
		return { status: 'expired' };
	}

	if (claims.expiresAt - now <= RENEWAL_THRESHOLD_MS) {
		// Never slide beyond original issue time + absolute lifetime.
		const renewedExpiry = Math.min(now + IDLE_LIFETIME_MS, absoluteExpiry);
		if (renewedExpiry <= claims.expiresAt) {
			return { status: 'valid', userId: claims.userId, renewed: false };
		}

		const renewedClaims = {
			...claims,
			expiresAt: renewedExpiry
		};
		setCookie(cookies, await encodeSession(renewedClaims), renewedClaims.expiresAt, now);
		return { status: 'valid', userId: claims.userId, renewed: true };
	}

	return { status: 'valid', userId: claims.userId, renewed: false };
}

export function clearSession(cookies: Cookies) {
	cookies.delete(AUTH_HINT_COOKIE_NAME, {
		httpOnly: false,
		sameSite: 'lax',
		secure: !dev,
		path: '/'
	});
	cookies.delete(SESSION_COOKIE_NAME, {
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		path: '/'
	});
}
