import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';

export type ThemeMode = 'light' | 'dark';

const THEME_CONTEXT = Symbol('theme');
export const THEME_COOKIE_NAME = 'theme';

export function isThemeMode(value: string | undefined): value is ThemeMode {
	return value === 'light' || value === 'dark';
}

export function getInitialThemeMode(): ThemeMode {
	return browser && document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export class ThemeContext {
	mode = $state<ThemeMode>('light');

	constructor(initialMode: ThemeMode) {
		this.mode = initialMode;
	}

	apply() {
		document.documentElement.classList.toggle('dark', this.mode === 'dark');
		document.cookie = `${THEME_COOKIE_NAME}=${this.mode}; Path=/; Max-Age=31536000; SameSite=Lax`;
	}

	toggle() {
		this.mode = this.mode === 'dark' ? 'light' : 'dark';
	}
}

export function createThemeContext(initialMode: ThemeMode): ThemeContext {
	const context = new ThemeContext(initialMode);
	setContext(THEME_CONTEXT, context);
	return context;
}

export function getThemeContext(): ThemeContext {
	const context = getContext<ThemeContext>(THEME_CONTEXT);

	if (!context) {
		throw new Error('Theme components must be used within a ThemeContext');
	}

	return context;
}
