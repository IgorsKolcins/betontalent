<script lang="ts">
	import { Button as BitsButton } from 'bits-ui';
	import { cva, type VariantProps } from 'class-variance-authority';
	import { cn } from '$lib/utils/cn';

	const buttonVariants = cva(
		'inline-flex shrink-0 items-center cursor-pointer justify-center gap-2 rounded-md text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 active:scale-[0.98]',
		{
			variants: {
				variant: {
					default:
						'bg-primary px-4 text-primary-foreground shadow-sm hover:bg-primary/90 dark:hover:bg-primary/85',
					secondary:
						'border border-border bg-secondary px-4 text-secondary-foreground hover:bg-accent hover:text-accent-foreground',
					ghost:
						'px-3 py-2 font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground',
					icon: 'size-9 border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
				}
			},
			defaultVariants: {
				variant: 'default'
			}
		}
	);

	type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
	type WithVariant<T> = T extends unknown
		? T & {
				class?: string;
				variant?: ButtonVariant;
			}
		: never;
	type ButtonProps = WithVariant<BitsButton.RootProps>;

	let { class: className, variant = 'default', ...rootProps }: ButtonProps = $props();
	const resolvedProps = $derived.by<BitsButton.RootProps>(() => {
		if (rootProps.href) return rootProps as BitsButton.RootProps;
		return { ...rootProps, type: rootProps.type ?? 'button' } as BitsButton.RootProps;
	});
</script>

<BitsButton.Root {...resolvedProps} class={cn(buttonVariants({ variant }), className)} />
