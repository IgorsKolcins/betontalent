<script lang="ts">
	import { resolve } from '$app/paths';
	import { BookOpenText, Search } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime.js';

	const avifSrcset =
		'/images/hero/hero-talent-640.avif 640w, /images/hero/hero-talent-960.avif 960w, /images/hero/hero-talent-1280.avif 1280w, /images/hero/hero-talent-1774.avif 1774w';
	const webpSrcset =
		'/images/hero/hero-talent-640.webp 640w, /images/hero/hero-talent-960.webp 960w, /images/hero/hero-talent-1280.webp 1280w, /images/hero/hero-talent-1774.webp 1774w';
	const imageSizes =
		'(min-width: 1200px) 1152px, (min-width: 768px) calc(100vw - 48px), calc(100vw - 40px)';
</script>

<svelte:head>
	<link
		rel="preload"
		as="image"
		type="image/avif"
		href="/images/hero/hero-talent-1280.avif"
		imagesrcset={avifSrcset}
		imagesizes={imageSizes}
		fetchpriority="high"
	/>
</svelte:head>

<Container>
	<section
		class="relative isolate flex min-h-144 items-end overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-2xl shadow-slate-950/20 md:min-h-136 md:items-center lg:aspect-2/1 lg:min-h-0"
		aria-labelledby="home-title"
	>
		<picture class="absolute inset-0 -z-10">
			<source type="image/avif" srcset={avifSrcset} sizes={imageSizes} />
			<source type="image/webp" srcset={webpSrcset} sizes={imageSizes} />
			<img
				src="/images/hero/hero-talent-1280.webp"
				alt=""
				width="1774"
				height="887"
				loading="eager"
				fetchpriority="high"
				decoding="async"
				class="size-full object-cover object-[69%_center]"
			/>
		</picture>

		<div class="max-w-xl px-6 py-8 text-white sm:px-10 sm:py-12 md:w-[58%] md:px-12 lg:px-16">
			<h1
				id="home-title"
				class="text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.9] tracking-[-0.04em] text-white"
			>
				{m['home.hero.title']()}
			</h1>
			<p class="mt-5 max-w-md text-base leading-7 text-white/75 md:text-lg">
				{m['home.hero.subtitle']()}
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<Button
					href={resolve(localizeHref('/blog') as '/blog')}
					class="group h-11 bg-white px-5 text-slate-950 hover:bg-white/90 focus-visible:outline-white"
				>
					<BookOpenText
						aria-hidden="true"
						class="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none"
					/>
					{m['nav.blog']()}
				</Button>
				<Button
					href={resolve(localizeHref('/search') as '/search')}
					variant="secondary"
					class="group h-11 border-white/35 bg-white/10 px-5 text-white shadow-sm backdrop-blur-sm hover:bg-white/20 hover:text-white focus-visible:outline-white"
				>
					<Search
						aria-hidden="true"
						class="size-4 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transform-none"
					/>
					{m['nav.search']()}
				</Button>
			</div>
		</div>
	</section>
</Container>
