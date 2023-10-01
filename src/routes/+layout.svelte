<script>
	import Nav from '$lib/components/Nav.svelte';
	import messagesStore from '$lib/stores/messages.store';
	import { Alert } from 'flowbite-svelte';
	import { CheckCircleSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import '$lib/firebase/firebase.client';
	import authStore from '$lib/stores/auth.store';
	import { onMount } from 'svelte';
	import { sendJWTToken } from '$lib/firebase/auth.client';
	import '../app.postcss';
	import '../app.css';

	export let data;
	let isLoggedIn = data.isLoggedIn;

	$: isLoggedIn = $authStore.isActive ? $authStore.isLoggedin : data.isLoggedIn;

	/**
	 * @type {string | number | NodeJS.Timeout | undefined}
	 */
	let timerId;

	async function sendServerToken() {
		try {
			await sendJWTToken();
		} catch (error) {
			console.log(error);
			clearInterval(timerId);
			messagesStore.showError();
		}
	}

	onMount(async () => {
		try {
			await sendServerToken();
			timerId = setInterval(
				async () => {
					await sendServerToken();
				},
				1000 * 10 * 60
			);
		} catch (error) {
			console.log(error);
			messagesStore.showError();
		}
	});

	function closeMessage() {
		messagesStore.hide();
	}
</script>

<div class="flex min-h-screen w-full flex-col">
	<div class="w-full flex-none">
		<Nav {isLoggedIn} user={data.user} />
	</div>
	<div class="w-full flex-auto">
		{#if $messagesStore.show}
			{#if $messagesStore.type === 'error'}
				<Alert class="mt-4 w-9/12 mx-auto" color="red" dismissable on:close={closeMessage}>
					<ExclamationCircleSolid slot="icon" class="w-4 h-4" />
					<span class="font-medium">Error: </span>
					{$messagesStore.message}
				</Alert>
			{:else if $messagesStore.type === 'success'}
				<Alert class="mt-4 w-9/12 mx-auto" color="green" dismissable on:close={closeMessage}>
					<CheckCircleSolid slot="icon" class="w-4 h-4" />
					<span class="font-medium">Success: </span>
					{$messagesStore.message}
				</Alert>
			{/if}
		{/if}
		<slot />
	</div>
</div>
