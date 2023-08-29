<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import RegisterForm from '$lib/components/Auth/RegisterForm.svelte';
	import { registerWithEmailandPassword } from '$lib/firebase/auth.client';
	import { afterLogin } from '$lib/helpers/route.helper';
	import messagesStore from '$lib/stores/messages.store';

	/**
	 * @param {any} e
	 */
	async function register(e) {
		try {
			const formData = new FormData(e.target);
			let email = formData.get('email');
			let password = formData.get('password');
			if (!email || !password) {
				messagesStore.showError('Please enter a valid email and password.');
				return;
			}

			if (password.length < 6) {
				messagesStore.showError('Password must be at least 6 characters.');
				return;
			}
			const user = await registerWithEmailandPassword(email.toString(), password.toString());
			await afterLogin($page.url, user.uid);
		} catch (error) {
			// @ts-ignore
			if (error.code === 'auth/email-already-in-use') {
				messagesStore.showError('You have already registered, please log in.');
				await goto('/login');
				return;
			}
			console.log(e);
			messagesStore.showError();
		}
	}
</script>

<RegisterForm on:submit={register} />

<svelte:head>
	<title>Sign Up</title>
</svelte:head>
