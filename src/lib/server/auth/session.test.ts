import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Cookies } from '@sveltejs/kit';
import type { CookieSerializeOptions } from 'cookie';
import { SESSION_COOKIE_NAME, clearSession, createSession, resolveSession } from './session';

const originalSecret = process.env.SESSION_SECRET;

beforeEach(() => {
	process.env.SESSION_SECRET = 'session-test-secret';
});

afterEach(() => {
	if (originalSecret === undefined) delete process.env.SESSION_SECRET;
	else process.env.SESSION_SECRET = originalSecret;
});

describe('session', () => {
	it('creates a signed session that resolves to the authenticated user', async () => {
		const jar = new MemoryCookieJar();

		await createSession(jar, 'user_1', 1_000_000);

		await expect(resolveSession(jar, 1_000_001)).resolves.toEqual({
			status: 'valid',
			userId: 'user_1',
			renewed: false
		});
		expect(jar.get(SESSION_COOKIE_NAME)).toMatch(/^[\w-]+\.[\w-]+$/);
		expect(jar.lastSetOptions).toEqual(
			expect.objectContaining({ httpOnly: true, sameSite: 'lax', path: '/' })
		);
	});

	it('renews an active session near its idle expiry', async () => {
		const jar = new MemoryCookieJar();
		const issuedAt = 1_000_000;

		await createSession(jar, 'user_1', issuedAt);

		await expect(resolveSession(jar, issuedAt + 30 * 60 * 1000)).resolves.toEqual({
			status: 'valid',
			userId: 'user_1',
			renewed: true
		});
		expect(jar.lastSetOptions?.maxAge).toBe(60 * 60);
	});

	it('rejects and removes a tampered session', async () => {
		const jar = new MemoryCookieJar();
		await createSession(jar, 'user_1', 1_000_000);
		jar.setRaw(SESSION_COOKIE_NAME, `${jar.get(SESSION_COOKIE_NAME)}tampered`);

		await expect(resolveSession(jar, 1_000_001)).resolves.toEqual({ status: 'invalid' });
		expect(jar.get(SESSION_COOKIE_NAME)).toBeUndefined();
	});

	it('expires and removes a session after its idle lifetime', async () => {
		const jar = new MemoryCookieJar();
		const issuedAt = 1_000_000;
		await createSession(jar, 'user_1', issuedAt);

		await expect(resolveSession(jar, issuedAt + 60 * 60 * 1000)).resolves.toEqual({
			status: 'expired'
		});
		expect(jar.get(SESSION_COOKIE_NAME)).toBeUndefined();
	});

	it('enforces the absolute lifetime despite repeated idle renewals', async () => {
		const jar = new MemoryCookieJar();
		const issuedAt = 1_000_000;
		const halfHour = 30 * 60 * 1000;
		await createSession(jar, 'user_1', issuedAt);

		for (let elapsed = halfHour; elapsed < 24 * 60 * 60 * 1000; elapsed += halfHour) {
			const resolution = await resolveSession(jar, issuedAt + elapsed);
			expect(resolution.status).toBe('valid');
		}

		await expect(resolveSession(jar, issuedAt + 24 * 60 * 60 * 1000)).resolves.toEqual({
			status: 'expired'
		});
	});

	it('clears the session through the public interface', async () => {
		const jar = new MemoryCookieJar();
		await createSession(jar, 'user_1');

		clearSession(jar);

		expect(jar.get(SESSION_COOKIE_NAME)).toBeUndefined();
	});
});

class MemoryCookieJar implements Cookies {
	readonly values = new Map<string, string>();
	lastSetOptions?: CookieSerializeOptions & { path: string };

	get(name: string): string | undefined {
		return this.values.get(name);
	}

	getAll(): Array<{ name: string; value: string }> {
		return Array.from(this.values, ([name, value]) => ({ name, value }));
	}

	set(name: string, value: string, options: CookieSerializeOptions & { path: string }): void {
		this.values.set(name, value);
		this.lastSetOptions = options;
	}

	delete(name: string): void {
		this.values.delete(name);
	}

	serialize(name: string, value: string): string {
		return `${name}=${value}`;
	}

	setRaw(name: string, value: string): void {
		this.values.set(name, value);
	}
}
