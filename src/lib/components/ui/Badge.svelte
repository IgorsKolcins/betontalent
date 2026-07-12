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
					outline: 'border-border bg-background text-foreground',
					draft:
						'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
					scheduled:
						'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
					active:
						'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
					paused:
						'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
					completed:
						'border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300',
					archived:
						'border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300'
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
