<script lang="ts">
	import { _ } from 'svelte-i18n';

	let { data } = $props();
	const postsJson = $derived(
		data.postsResult.ok
			? JSON.stringify(data.postsResult.data.posts, null, 2)
			: JSON.stringify(data.postsResult, null, 2)
	);
</script>

<svelte:head>
	<title>{$_('blog.title')} | {$_('app.title')}</title>
	<meta name="description" content={$_('blog.description')} />
</svelte:head>

<main class="min-h-screen py-10 md:py-14">
	<section class="container space-y-6" aria-labelledby="blog-title">
		<div class="max-w-2xl space-y-3">
			<p class="text-sm font-semibold tracking-[0.08em] text-brand uppercase">
				{$_('blog.apiLabel')}
			</p>
			<h1 id="blog-title" class="text-4xl leading-tight font-bold text-foreground md:text-5xl">
				{$_('blog.title')}
			</h1>
			<p class="text-base leading-7 text-muted-foreground">
				{$_('blog.description')}
			</p>
		</div>

		<div class="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
			<div class="border-b border-border px-4 py-3 text-sm font-semibold text-card-foreground">
				{$_('blog.rawJsonLabel')}
			</div>
			<pre
				class="max-h-[70vh] overflow-auto bg-primary p-4 text-xs leading-5 whitespace-pre-wrap text-primary-foreground md:text-sm">{postsJson}</pre>
		</div>
	</section>
</main>
