/**
 * Small API helper guide
 *
 * Keep route-specific functions thin and validate the response in that route module:
 *
 * ```ts
 * export async function getPosts(fetcher: ApiFetch) {
 *   const result = await apiFetch<unknown>(fetcher, '/api/posts', {
 *     errorUserMessage: 'Could not load blog posts'
 *   });
 *
 *   if (!result.ok) return result;
 *
 *   const parsed = postsResponseSchema.safeParse(result.data);
 *   return parsed.success
 *     ? { ok: true, data: parsed.data }
 *     : { ok: false, status: 502, error: 'Could not load blog posts' };
 * }
 * ```
 *
 * ```ts
 * export async function createPost(fetcher: ApiFetch, input: CreatePostInput) {
 *   return apiFetch<Post>(fetcher, '/api/posts', {
 *     method: 'POST',
 *     body: input,
 *     errorUserMessage: 'Could not create blog post'
 *   });
 * }
 * ```
 *
 * Pass SvelteKit's `fetch` from `load` functions so internal `/api/*` requests keep
 * cookies, headers, and SSR behavior. Use native `fetch` only from browser-only code.
 */
export type ApiResult<T> =
	| {
			ok: true;
			data: T;
	  }
	| {
			ok: false;
			error: string;
			status?: number;
	  };

export type ApiFetch = typeof fetch;

type ApiFetchOptions = {
	// Omit `method` for GET requests; the platform default is GET.
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	// Bodies are JSON-serialized here so endpoint helpers stay small and consistent.
	body?: unknown;
	// This message is safe to show in UI. Detailed diagnostics stay in server logs.
	errorUserMessage?: string;
};

export async function apiFetch<T>(
	fetcher: ApiFetch,
	path: string,
	options: ApiFetchOptions = {}
): Promise<ApiResult<T>> {
	const { body, method, errorUserMessage } = options;
	const errorMessage = errorUserMessage ?? 'API service unavailable';

	let response: Response;

	try {
		// The fetcher is injected for SvelteKit SSR and for tests; do not import global fetch here.
		response = await fetcher(path, {
			method,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: body === undefined ? undefined : JSON.stringify(body)
		});
	} catch (err) {
		console.error('API network error', {
			path,
			method,
			body,
			error: err
		});

		return {
			ok: false,
			status: 503,
			error: errorMessage
		};
	}

	// Non-2xx responses are normalized instead of thrown so pages can render explicit error states.
	if (!response.ok) {
		console.error('API response error', {
			path,
			method,
			body,
			status: response.status
		});

		return {
			ok: false,
			status: response.status,
			error: errorMessage
		};
	}

	try {
		// Contract validation belongs in endpoint-specific helpers after this generic JSON parse.
		return {
			ok: true,
			data: (await response.json()) as T
		};
	} catch (err) {
		console.error('API response parse error', {
			path,
			method,
			body,
			status: response.status,
			error: err
		});

		return {
			ok: false,
			status: response.status,
			error: errorMessage
		};
	}
}
