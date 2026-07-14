<script lang="ts">
	import FeaturesSection from '$lib/components/home/FeaturesSection.svelte';
	import FinalCtaSection from '$lib/components/home/FinalCtaSection.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import PricingSection from '$lib/components/home/PricingSection.svelte';
	import SocialProofSection from '$lib/components/home/SocialProofSection.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m['app.title']()}</title>
	<meta name="description" content={m['app.description']()} />
	<link rel="canonical" href={data.seo.canonical} />
	{#each data.seo.alternates as alternate (alternate.hreflang)}
		<link rel="alternate" hreflang={alternate.hreflang} href={alternate.href} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={data.seo.xDefault} />
</svelte:head>

<main class="min-h-screen pt-4 md:pt-6">
	<HeroSection />
	<FeaturesSection features={data.homepage.features} />
	<SocialProofSection socialProof={data.homepage.socialProof} />
	<PricingSection pricing={data.homepage.pricing} />
	<FinalCtaSection />
</main>
