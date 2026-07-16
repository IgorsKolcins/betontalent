<script lang="ts">
	import { afterNavigate, onNavigate } from '$app/navigation';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { getBlogTransition } from '$lib/view-transitions/blog';

	let { children } = $props();
	let activeBlogTransition = 0;

	afterNavigate(() => {
		document.documentElement.dataset.authState = document.cookie.split('; ').includes('auth_hint=1')
			? 'authenticated'
			: 'anonymous';
	});

	onNavigate((navigation) => {
		const blogTransition = getBlogTransition(
			navigation.from?.url ?? null,
			navigation.to?.url ?? null
		);

		if (
			!blogTransition ||
			!document.startViewTransition ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			return;
		}

		const root = document.documentElement;
		const transitionId = ++activeBlogTransition;
		root.dataset.blogTransition = blogTransition.direction;
		nameBlogCover(blogTransition.slug);

		return new Promise<void>((resolve) => {
			try {
				const transition = document.startViewTransition(async () => {
					resolve();
					await navigation.complete;
					nameBlogCover(blogTransition.slug);
				});
				const cleanup = () => {
					if (activeBlogTransition !== transitionId) return;
					delete root.dataset.blogTransition;
					nameBlogCover(blogTransition.slug, '');
				};

				void transition.finished.then(cleanup, cleanup);
			} catch {
				if (activeBlogTransition === transitionId) {
					delete root.dataset.blogTransition;
					nameBlogCover(blogTransition.slug, '');
				}
				resolve();
			}
		});
	});

	function nameBlogCover(slug: string, transitionName = 'blog-post-cover'): void {
		for (const cover of document.querySelectorAll<HTMLElement>('[data-blog-cover]')) {
			if (cover.dataset.blogCover === slug) {
				cover.style.viewTransitionName = transitionName;
			}
		}
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
