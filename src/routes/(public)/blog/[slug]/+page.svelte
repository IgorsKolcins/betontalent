<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowLeft } from '@lucide/svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
	import { absoluteUrl } from '$lib/seo';

	let { data } = $props();
	const locale = $derived(getLocale());
	const blogHref = $derived(resolve(localizeHref('/blog') as '/blog'));
	const backHref = $derived(resolve(data.backHref as '/'));
	const dateFormatter = $derived(
		new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' })
	);
	const paragraphs = $derived(data.post.body.split('\n\n'));
	const articleJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: data.post.title,
		description: data.post.excerpt,
		datePublished: data.post.publishedAt,
		author: { '@type': 'Person', name: data.post.author.name },
		mainEntityOfPage: data.seo.canonical,
		keywords: data.post.tags.join(', '),
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: m['blog.title'](),
					item: absoluteUrl(data.seo.canonical, blogHref)
				},
				{ '@type': 'ListItem', position: 2, name: data.post.title, item: data.seo.canonical }
			]
		}
	});
</script>

<svelte:head>
	<title>{data.post.title} | {m['app.title']()}</title>
	<meta name="description" content={data.post.excerpt} />
	<link rel="canonical" href={data.seo.canonical} />
	{#each data.seo.alternates as alternate (alternate.hreflang)}
		<link rel="alternate" hreflang={alternate.hreflang} href={alternate.href} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={data.seo.xDefault} />
	{@html `<script type="application/ld+json">${JSON.stringify(articleJsonLd).replaceAll('<', '\\u003c')}<\/script>`}
</svelte:head>

<main class="min-h-screen py-8 md:py-12">
	<Container as="article" class="max-w-3xl">
		<Button href={backHref} variant="ghost" class="mb-8 -ml-3">
			<ArrowLeft class="size-4" aria-hidden="true" />
			{m['blog.back']()}
		</Button>

		<div
			class="mb-8 h-48 rounded-xl border border-border md:h-72"
			style:background-color={data.post.coverColor}
			role="img"
			aria-label={m['blog.coverLabel']({ title: data.post.title })}
		></div>

		<header class="space-y-5 border-b border-border pb-8">
			<div class="flex flex-wrap gap-2">
				{#each data.post.tags as tag (tag)}<Badge variant="outline">{tag}</Badge>{/each}
			</div>
			<h1 class="text-4xl leading-tight font-bold text-foreground md:text-5xl">
				{data.post.title}
			</h1>
			<p class="text-lg leading-8 text-muted-foreground">{data.post.excerpt}</p>
			<div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
				<span
					class="size-8 rounded-full border border-border"
					style:background-color={data.post.author.avatarColor}
					aria-hidden="true"
				></span>
				<span>{m['blog.publishedBy']({ author: data.post.author.name })}</span>
				<span aria-hidden="true">·</span>
				<time datetime={data.post.publishedAt}
					>{dateFormatter.format(new Date(data.post.publishedAt))}</time
				>
				<span aria-hidden="true">·</span>
				<span>{m['blog.readingTime']({ minutes: data.post.readingTimeMinutes })}</span>
			</div>
		</header>

		<div class="prose prose-neutral dark:prose-invert mt-8 max-w-none">
			{#each paragraphs as paragraph, index (`${index}-${paragraph.slice(0, 20)}`)}
				<p>{paragraph}</p>
			{/each}
		</div>
	</Container>
</main>
