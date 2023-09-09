<script>
	import { Section, Register } from 'flowbite-svelte-blocks';
	import { Button, Label, Input } from 'flowbite-svelte';
	import LoginWithGoogle from '$lib/components/Auth/LoginWithGoogle.svelte';
</script>

<Section name="register">
	<Register
		aClass="mt-6 flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-900"
		divClass="w-full bg-white rounded-lg shadow dark:border lg:w-8/12 md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
	>
		<svelte:fragment slot="top">
			<img class="w-10 h-10 mr-4" src="/logo.png" alt="logo" />MyScholar</svelte:fragment
		>
		<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
			<form class="flex flex-col space-y-6" on:submit|preventDefault>
				<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Sign Up</h3>
				<Label class="space-y-2">
					<span>Email</span>
					<Input type="email" name="email" placeholder="name@domain.com" required />
				</Label>
				<Label class="space-y-2">
					<span>Password</span>
					<Input type="password" name="password" placeholder="*****" required />
				</Label>
				<Button size="sm" type="submit" class="w-full1">Sign Up</Button>
				<LoginWithGoogle option="Sign Up" />
				<p class="text-sm font-light text-gray-500 dark:text-gray-400">
					Already have an account?
					<a
						href="/login"
						class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In</a
					>
				</p>
			</form>
		</div>
	</Register>
</Section>
