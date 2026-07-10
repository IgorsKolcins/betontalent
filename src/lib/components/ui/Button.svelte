<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	const buttonVariants = cva(
		'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
		{
			variants: {
				variant: {
					default:
						'bg-primary px-4 text-primary-foreground shadow-sm hover:bg-primary/90 dark:hover:bg-primary/85',
					secondary:
						'border border-border bg-secondary px-4 text-secondary-foreground hover:bg-accent hover:text-accent-foreground',
					icon: 'size-9 border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
				}
			},
			defaultVariants: {
				variant: 'default'
			}
		}
	);

	type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
	type ButtonProps = HTMLButtonAttributes & {
		children?: Snippet;
		class?: string;
		variant?: ButtonVariant;
	};

	let {
		children,
		class: className,
		variant = 'default',
		type = 'button',
		...restProps
	}: ButtonProps = $props();
</script>

<button {...restProps} {type} class={cn(buttonVariants({ variant }), className)}>
	{@render children?.()}
</button>
