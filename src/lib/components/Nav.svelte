<script>
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
	let activeClass =
		'text-white bg-primary-700 md:bg-transparent md:text-primary-700 md:dark:text-white dark:bg-primary-600 md:dark:bg-transparent';
	let nonActiveClass =
		'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent';
	let isLoggedIn = false;
</script>

<Navbar let:hidden let:toggle color="light">
	<NavBrand href="/">
		<img src="/logo.png" class="mr-3 h-10 sm:h-10" alt="MyScholar Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
			>MyScholar</span
		>
	</NavBrand>
	<NavHamburger on:click={toggle} />
	{#if isLoggedIn}
		<NavUl {activeUrl} {hidden} {activeClass} {nonActiveClass}>
			<NavLi href="/">Home</NavLi>
			<NavLi href="/profile">Profile</NavLi>
			<NavLi href="/profile/scholarships">My Scholarships</NavLi>
			<NavLi>Log out</NavLi>
		</NavUl>
	{:else}
		<NavUl {activeUrl} {hidden} {activeClass} {nonActiveClass}>
			<NavLi href="/">Home</NavLi>
			<NavLi href="/login">Login</NavLi>
			<NavLi href="/signup">Sign up</NavLi>
		</NavUl>
	{/if}
</Navbar>
