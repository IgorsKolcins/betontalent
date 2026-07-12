<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
		name: string;
		class?: string;
	};

	let { name, class: className, ...restProps }: AvatarProps = $props();
	const initial = $derived(Array.from(name.trim())[0]?.toLocaleUpperCase() ?? '?');
</script>

<span
	aria-hidden="true"
	class={cn(
		'inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-brand text-xl font-bold text-brand-foreground shadow-sm',
		className
	)}
	{...restProps}
>
	{initial}
</span>
