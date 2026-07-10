<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	const badgeVariants = cva(
		'inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-xs leading-5 font-semibold transition-colors',
		{
			variants: {
				variant: {
					default: 'border-transparent bg-primary text-primary-foreground',
					secondary: 'border-transparent bg-secondary text-secondary-foreground',
					outline: 'border-border bg-background text-foreground'
				}
			},
			defaultVariants: {
				variant: 'secondary'
			}
		}
	);

	type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;
	type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
		children?: Snippet;
		class?: string;
		variant?: BadgeVariant;
	};

	let { children, class: className, variant = 'secondary', ...restProps }: BadgeProps = $props();
</script>

<span data-slot="badge" class={cn(badgeVariants({ variant }), className)} {...restProps}>
	{@render children?.()}
</span>
