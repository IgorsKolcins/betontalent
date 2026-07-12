<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
		name: string;
		class?: string;
		size?: 'default' | 'sm';
	};

	let { name, class: className, size = 'default', ...restProps }: AvatarProps = $props();
	const initial = $derived(Array.from(name.trim()).slice(0, 2).join('').toLocaleUpperCase() || '?');
</script>

<span
	aria-hidden="true"
	class={cn(
		'inline-flex shrink-0 items-center justify-center rounded-full bg-brand font-bold text-brand-foreground shadow-sm',
		size === 'sm' ? 'size-7 text-[0.625rem]' : 'size-14 text-xl',
		className
	)}
	{...restProps}
>
	{initial}
</span>
