<script>
	import { Button } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import { loginWithGoogle } from '$lib/firebase/auth.client';
	import { afterLogin } from '$lib/helpers/route.helper';
	import messagesStore from '$lib/stores/messages.store';
	/**
	 * @type {string}
	 */
	export let option;

	async function loginGoogle() {
		try {
			const user = await loginWithGoogle();
			await afterLogin($page.url, user.uid);
		} catch (e) {
			// @ts-ignore
			if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') {
				return;
			}
			console.log(e);
			messagesStore.showError();
		}
	}
</script>

<Button on:click={loginGoogle} size="sm" color="blue" class="!mt-4">
	<Icon name="google-solid" class="w-3 h-3 mr-2" />
	{option} with Google
</Button>
