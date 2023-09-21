<script>
	import Scholarship from '$lib/components/Scholarship/Scholarship.svelte';

	export let data;

	/**
	 * @param {any} e
	 */
	function filterUnsavedScholarships(e) {
		const { id } = e.detail;
		// @ts-ignore
		data.scholarships = data.scholarships.filter((scholarship) => scholarship.id != id);
	}
</script>

<div id="main" class="px-8 lg:flex-1 lg:max-w-2xl lg:pb-14 lg:pt-10 lg:px-4">
	<h3 class="text-xl font-bold mb-10 mt-8 lg:text-l lg:mt-0 lg:ml-0">Saved scholarships</h3>
	{#if data.scholarships.length <= 0}
		<h3 class="font-bold text-medium">You haven't saved any scholarships.</h3>
		<p class="mt-6">
			Save scholarships you like by using the "Save" button on the search results or scholarship
			details page.
		</p>
	{:else}
		<div class="flex flex-col items-center">
			{#each data.scholarships as scholarship (scholarship.id)}
				<Scholarship {scholarship} on:save_scholarship={filterUnsavedScholarships} />
			{/each}
		</div>
	{/if}
</div>
