<script lang="ts">
	import { resolve } from '$app/paths';
	import { Search } from '@lucide/svelte';
	import { untrack } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import Button from '$lib/components/ui/Button.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import {
		MAX_POST_QUERY_LENGTH,
		postQueryFormSchema,
		type PostQueryForm
	} from '$lib/api/posts/query';

	type ActionPath = '/blog' | '/search';

	let {
		action,
		formData,
		showSearch = false,
		tags = []
	}: {
		action: ActionPath;
		formData: SuperValidated<PostQueryForm>;
		showSearch?: boolean;
		tags?: string[];
	} = $props();

	const { form, errors } = superForm(
		untrack(() => formData),
		{
			validators: zod4Client(postQueryFormSchema),
			validationMethod: 'oninput',
			resetForm: false
		}
	);
</script>

<form
	method="GET"
	{action}
	class="grid gap-4 rounded-lg border border-border bg-card p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(10rem,14rem)_auto]"
>
	{#if showSearch}
		<FormField
			label={$_('search.queryLabel')}
			error={$errors.q?.[0]
				? $_('search.queryMaxError', { values: { max: MAX_POST_QUERY_LENGTH } })
				: undefined}
		>
			<Input
				name="q"
				type="search"
				placeholder={$_('search.placeholder')}
				bind:value={$form.q}
				aria-invalid={$errors.q ? 'true' : undefined}
			>
				{#snippet button()}
					<span class="flex items-center px-3 text-muted-foreground">
						<Search aria-hidden="true" class="size-4" />
					</span>
				{/snippet}
			</Input>
		</FormField>

		<FormField label={$_('search.tagLabel')}>
			<select
				name="tag"
				bind:value={$form.tag}
				class="min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors duration-150 hover:border-ring focus:border-ring focus:outline-2 focus:outline-offset-2 focus:outline-ring"
			>
				<option value="">{$_('search.allTags')}</option>
				{#each tags as tag (tag)}
					<option value={tag}>{tag}</option>
				{/each}
			</select>
		</FormField>
	{/if}

	<FormField label={$_('filters.sortLabel')} class={showSearch ? '' : 'md:col-span-2'}>
		<select
			name="sort"
			bind:value={$form.sort}
			class="min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors duration-150 hover:border-ring focus:border-ring focus:outline-2 focus:outline-offset-2 focus:outline-ring"
		>
			<option value="publishedAt-desc">{$_('filters.sort.newest')}</option>
			<option value="publishedAt-asc">{$_('filters.sort.oldest')}</option>
			<option value="title-asc">{$_('filters.sort.titleAsc')}</option>
			<option value="title-desc">{$_('filters.sort.titleDesc')}</option>
			<option value="readingTimeMinutes-asc">{$_('filters.sort.shortest')}</option>
			<option value="readingTimeMinutes-desc">{$_('filters.sort.longest')}</option>
		</select>
	</FormField>

	<input type="hidden" name="page" value="1" />

	<div class="flex items-end gap-2">
		<Button type="submit" class="h-10">{$_('filters.apply')}</Button>
		{#if showSearch}
			<a
				href={resolve(action)}
				class="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-border bg-secondary px-4 text-sm font-semibold text-secondary-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
			>
				{$_('filters.clear')}
			</a>
		{/if}
	</div>
</form>
