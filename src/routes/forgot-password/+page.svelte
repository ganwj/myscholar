<script>
	import { mailResetPassword } from '$lib/firebase/auth.client';
	import messagesStore from '$lib/stores/messages.store';
	import { Card, Button, Label, Input, P } from 'flowbite-svelte';

	let hideForm = false;

	/**
	 * @param {any} e
	 */
	async function onForgotPassword(e) {
		try {
			const formData = new FormData(e.target);
			const emailAddress = formData.get('email');
			if (!emailAddress) {
				messagesStore.showError('Please enter a valid email address.');
				return;
			}
			await mailResetPassword(emailAddress.toString());
			hideForm = true;
			messagesStore.showSuccess('Reset Password Email Sent!');
		} catch (error) {
			// @ts-ignore
			if (error.code === 'auth/user-not-found') {
				messagesStore.showError('Email not found, please try again.');
			} else {
				messagesStore.showError();
			}
		}
	}
</script>

{#if !hideForm}
	<Card class="w-11/12 max-w-md relative left-1/2 -translate-x-1/2 mt-16 lg:w-full">
		<form class="flex flex-col space-y-6" on:submit|preventDefault={onForgotPassword}>
			<h3 class="text-3xl font-normal text-gray-900 dark:text-white">Forgot Password?</h3>
			<P weight="normal" color="text-gray-700 dark:text-white"
				>Enter your email below for us to send you a password reset link to your email.</P
			>
			<Label class="space-y-2 dark:text-white">
				<span>Email</span>
				<Input type="email" name="email" placeholder="Email Address" required />
			</Label>
			<Button size="sm" type="submit" class="w-full">Send Password Reset Link</Button>
		</form>
	</Card>
{/if}

<svelte:head>
	<title>Reset Password</title>
</svelte:head>
