<!-- <script>
	import messageStore from '$lib/stores/messages.store';
	import authStore from '$lib/stores/auth.store';
	import { createEventDispatcher } from 'svelte';

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

<div></div> -->
