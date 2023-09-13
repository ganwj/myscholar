<script>
	import { page } from '$app/stores';
	import LoginForm from '$lib/components/Auth/LoginForm.svelte';
	import { loginWithEmailAndPassword } from '$lib/firebase/auth.client';
	import { afterLogin } from '$lib/helpers/route.helper';
	import messagesStore from '$lib/stores/messages.store';

	/**
	 * @param {any} e
	 */
	async function onLogin(e) {
		try {
			const formData = new FormData(e.target);
			const email = formData.get('email');
			const password = formData.get('password');
			if (!email || !password) {
				messagesStore.showError('Please enter a valid email and password.');
				return;
			}
			const user = await loginWithEmailAndPassword(email.toString(), password.toString());
			await afterLogin($page.url, user.uid);
		} catch (error) {
			if (
				// @ts-ignore
				['auth/invalid-email', 'auth/user-not-found', 'auth/wrong-password'].includes(error.code)
			) {
				messagesStore.showError('Invalid email or password');
				return;
			}
			messagesStore.showError();
		}
	}
</script>

<div class="form-container mb-10">
	<LoginForm on:submit={onLogin} />
</div>
