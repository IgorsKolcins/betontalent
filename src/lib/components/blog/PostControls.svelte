<script lang="ts">
	import { resolve } from '$app/paths';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import FormField from '$lib/components/ui/FormField.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { MAX_POST_QUERY_LENGTH, type PostQueryForm } from '$lib/api/posts/query';

	type BaseProps = {
		formData: SuperValidated<PostQueryForm>;
		class?: string;
	};

	type PostControlsProps =
		| (BaseProps & { mode: 'blog' })
		| (BaseProps & { mode: 'search'; tags: string[]; totalCount: number });

	let { formData, class: className, ...routeProps }: PostControlsProps = $props();

	const query = $derived(formData.data);
	const queryError = $derived(formData.errors.q?.[0]);
	const searchProps = $derived(routeProps.mode === 'search' ? routeProps : undefined);

	function submitForm(event: Event & { currentTarget: HTMLSelectElement }) {
		event.currentTarget.form?.requestSubmit();
	}
</script>

{#snippet sortOptions()}
	<option value="publishedAt-desc">{m['filters.sort.newest']()}</option>
	<option value="publishedAt-asc">{m['filters.sort.oldest']()}</option>
	<option value="title-asc">{m['filters.sort.titleAsc']()}</option>
	<option value="title-desc">{m['filters.sort.titleDesc']()}</option>
	<option value="readingTimeMinutes-asc">{m['filters.sort.shortest']()}</option>
	<option value="readingTimeMinutes-desc">{m['filters.sort.longest']()}</option>
{/snippet}

<form method="GET" action={resolve(localizeHref(`/${routeProps.mode}`) as '/')} class={className}>
	{#snippet sortControl(className = '')}
		<label class={['flex items-center gap-3 text-sm font-medium text-foreground', className]}>
			<span>{m['filters.sortLabel']()}</span>
			<Select class="w-44" name="sort" value={query.sort} onchange={submitForm}>
				{@render sortOptions()}
			</Select>
		</label>
	{/snippet}

	{#if searchProps}
		<div
			class="grid gap-x-4 md:grid-cols-[minmax(0,1fr)_minmax(10rem,14rem)_auto] bg-muted border border-border rounded-md p-4 mb-10"
		>
			<FormField
				label={m['search.queryLabel']()}
				error={queryError ? m['search.queryMaxError']({ max: MAX_POST_QUERY_LENGTH }) : undefined}
			>
				<SearchInput
					name="q"
					placeholder={m['search.placeholder']()}
					value={query.q}
					maxlength={MAX_POST_QUERY_LENGTH}
					aria-invalid={queryError ? 'true' : undefined}
					clearLabel={m['search.clearLabel']()}
					submitLabel={m['search.submitLabel']()}
				/>
			</FormField>

			<FormField label={m['search.tagLabel']()}>
				<Select name="tag" value={query.tag} onchange={submitForm}>
					<option value="">{m['search.allTags']()}</option>
					{#each searchProps.tags as tag (tag)}
						<option value={tag}>{tag}</option>
					{/each}
				</Select>
			</FormField>

			<div class="flex items-end pb-6">
				<a
					href={resolve(localizeHref(`/${routeProps.mode}`) as '/')}
					class="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-border bg-secondary px-4 text-sm font-semibold text-secondary-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
				>
					{m['filters.clear']()}
				</a>
			</div>
		</div>

		<div class="flex flex-wrap items-center justify-between gap-4">
			<p class="text-sm font-medium text-muted-foreground">
				{#if query.q}
					{m['search.results']({ count: searchProps.totalCount, query: query.q })}
				{:else}
					{m['search.resultsCount']({ count: searchProps.totalCount })}
				{/if}
			</p>

			{@render sortControl('ml-auto')}
		</div>
	{:else}
		{@render sortControl()}
	{/if}

	<input type="hidden" name="page" value="1" />
</form>
