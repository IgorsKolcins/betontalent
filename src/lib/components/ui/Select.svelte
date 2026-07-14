<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	const selectVariants = cva(
		'w-full min-w-0 appearance-none text-sm text-foreground transition-colors duration-150 cursor-pointer focus:ring-0 focus:outline-2 focus:outline-offset-2 focus:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
		{
			variants: {
				variant: {
					default:
						'min-h-10 rounded-md border border-input bg-background py-2 pr-9 pl-3 shadow-sm hover:border-ring focus:border-ring',
					ghost:
						'min-h-9 rounded-md border border-transparent bg-transparent py-1 pr-8 pl-2 shadow-none hover:bg-accent hover:text-accent-foreground focus:bg-accent'
				}
			},
			defaultVariants: {
				variant: 'default'
			}
		}
	);

	type SelectVariant = NonNullable<VariantProps<typeof selectVariants>['variant']>;
	type SelectProps = HTMLSelectAttributes & {
		class?: string;
		value?: string;
		children?: Snippet;
		variant?: SelectVariant;
	};

	let {
		class: className,
		value = $bindable(undefined),
		children,
		variant = 'default',
		...rest
	}: SelectProps = $props();
</script>

<div class="relative min-w-0">
	<select class={cn(selectVariants({ variant }), className)} bind:value {...rest}>
		{@render children?.()}
	</select>
</div>
