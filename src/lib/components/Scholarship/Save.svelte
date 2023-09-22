<script>
	import messageStore from '$lib/stores/messages.store';
	import authStore from '$lib/stores/auth.store';
	import { createEventDispatcher } from 'svelte';
	import { BookmarkOutline, BookmarkSolid } from 'flowbite-svelte-icons';

	const dispatch = createEventDispatcher();

	/**
	 * @type {any}
	 */
	export let scholarship;
	let submitting = false;

	async function saveScholarship() {
		if (!$authStore.isLoggedin) {
			return;
		}

		try {
			submitting = true;
			const response = await fetch(`/save/${scholarship.id}`);
			scholarship = await response.json();
			dispatch('save_scholarship', { id: scholarship.id });
		} catch (e) {
			messageStore.showError();
		}

		submitting = false;
	}
</script>

<button
	disabled={submitting}
	class:not-logged-in={!$authStore.isLoggedin}
	on:click|stopPropagation={saveScholarship}
	class="flex items-center justify-center gap-1.5 mt-8 mx-4 self-end shrink py-1 w-4/12 border border-solid !border-gray-400 rounded focus:ring-none whitespace-nowrap bg-white hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100 md:col-start-3 md:col-end-4 md:justify-self-end md:mt-0 md:w-6/12"
>
	{#if scholarship.savedScholarship}
		<BookmarkSolid size="sm" class="text-primary-700" />
		<span class="text-gray-700">Saved</span>
	{:else}
		<BookmarkOutline size="sm" strokeWidth="1" class="text-primary-700" />
		<span class="text-gray-700">Save</span>
	{/if}
</button>

<style>
	.not-logged-in {
		cursor: not-allowed;
	}
</style>
