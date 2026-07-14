import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Select from './Select.svelte';

describe('Select', () => {
	it.each(['default', 'ghost'] as const)(
		'uses only the native indicator for the %s variant',
		(variant) => {
			render(Select, {
				variant,
				children: undefined
			});

			expect(document.querySelector('svg')).toBeNull();
		}
	);
});
