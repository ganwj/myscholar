<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { logout } from '$lib/firebase/auth.client';
	import messagesStore from '$lib/stores/messages.store';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
	let activeClass =
		'text-gray-700 bg-gray-300 md:bg-transparent md:hover:underline md:hover:text-gray-900 md:dark:text-white dark:bg-primary-600 md:dark:bg-transparent';
	let nonActiveClass =
		'text-gray-700 hover:bg-gray-200 md:hover:bg-transparent md:hover:underline md:border-0 md:hover:text-gray-900 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent';
	let navClass = 'border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800';
	let navDivClass = 'flex flex-wrap justify-between items-center mx-auto max-w-screen-xl';
	export let isLoggedIn = false;
	/**
	 * @type {any}
	 */
	export let user;

	async function onLogOut() {
		try {
			await logout();
			goto('/');
		} catch (error) {
			messagesStore.showError();
		}
	}
</script>

<Navbar let:hidden let:toggle {navClass} {navDivClass}>
	<NavBrand href="/">
		<img src="/logo.png" class="mr-3 h-9 sm:h-10" alt="MyScholar logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold">MyScholar</span>
	</NavBrand>
	{#if !isLoggedIn}
		<div class="flex items-center lg:order-2">
			<Button href="/login" color="light">Login</Button>
			<Button href="/signup" class="ml-2" color="primary">Sign Up</Button>
		</div>
	{:else}
		<NavHamburger
			on:click={toggle}
			btnClass="inline-flex items-center p-2 ml-1 text-sm text-gray-600 rounded-lg md:hidden lg:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
		/>
		<NavUl {activeUrl} {hidden} {activeClass} {nonActiveClass}>
			<NavLi href="/">Home</NavLi>
			<NavLi href={user && user.hasProfile ? '/profile/pa' : '/profile/edit'}>Profile</NavLi>
			<NavLi href="/scholarships">Scholarships</NavLi>
			<NavLi class="cursor-pointer md:text-gray-600" on:click={onLogOut}>Log out</NavLi>
		</NavUl>
	{/if}
</Navbar>
