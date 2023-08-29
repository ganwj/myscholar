<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { Section, Page404 } from 'flowbite-svelte-blocks';
	import { Button } from 'flowbite-svelte';
</script>

<Section name="page404">
	<Page404
		h1Class="mb-4 text-7xl tracking-tight font-extrabold text-gray-700 lg:text-9xl dark:text-white"
		divClass="mx-auto max-w-screen-sm text-center mt-20"
	>
		<svelte:fragment slot="h1">{$page.status}</svelte:fragment>
		<svelte:fragment slot="paragraph">
			<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
				{$page.error.message}
			</p>
			<Button href="/" size="lg" color="red">Back to Homepage</Button>
		</svelte:fragment>
	</Page404>
</Section>
