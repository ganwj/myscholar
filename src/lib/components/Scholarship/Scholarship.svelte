<script>
	import { Badge, Card } from 'flowbite-svelte';
	import { BookSolid } from 'flowbite-svelte-icons';
	import { StairsSolid } from 'svelte-awesome-icons';
	import { P } from 'flowbite-svelte';
	import Save from './Save.svelte';
	import { goto } from '$app/navigation';
	/**
	 * @type {any}
	 */
	export let scholarship;

	async function clicked() {
		await goto('/scholarship-detail/' + scholarship.id);
	}
</script>

<!-- svelte-ignore a11y-positive-tabindex -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-interactive-supports-focus -->
<div
	on:click={clicked}
	role="button"
	class="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg border border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700 shadow-md flex max-w-sm flex-col hover:bg-gray-100 dark:hover:bg-gray-700 p-4 sm:p-6 horizontal reverse=false relative items-center mb-8 md:grid md:grid-cols-3 md:max-w-2xl"
>
	<div class="image-box mt-8 md:col-span-1 md:mt-0">
		<div class="flex items-center justify-center">
			<img src={scholarship.imageURL} alt="Institution logo" class="w-full" />
		</div>
	</div>
	{#if scholarship.interview === 'no'}
		<div class="interview-info left-0 md:top-5">
			<span>No Interview</span>
		</div>
	{/if}
	<div class="scholarship-detail md:col-span-2 md:ml-12">
		<h3 class="mb-2 text-lg font-bold text-gray-700 mt-5 dark:text-white md:mt-0">
			{scholarship.name}
		</h3>
		<div>
			<Badge color="red">{scholarship.country}</Badge>
			{#each scholarship.type as type}
				<Badge color="green" class="mr-1">{type}</Badge>
			{/each}
		</div>
		<P class="my-3 text-sm font-normal text-gray-700 dark:text-gray-400">
			{scholarship.description}
		</P>
		<P class="mb-3 text-md font-semibold text-gray-800 dark:text-gray-400">Applicable For:</P>
		<div class="bottom-detail flex flex-wrap items-center gap-5 text-sm text-gray-700">
			<div class="scholarship-level flex items-center">
				<StairsSolid color="#991b1b" size="18" class="mr-1.5" />
				<span>{scholarship.course_level}</span>
			</div>
			<div class="scholarship-field flex items-center">
				<BookSolid color="#991b1b" size="sm" class="mr-1.5" />
				<span>{scholarship.field_of_study}</span>
			</div>
		</div>
	</div>
	<Save {scholarship} on:save_scholarship />
</div>

<style>
	.interview-info {
		position: absolute;
		color: #fff;
		font-size: 0.65rem;
		box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.16);
		border: 2px solid #fff;
		border-left: none;
		padding: 3px 10px;
		background-color: #3e67af;
	}

	.image-box {
		border: 2px solid rgba(0, 0, 0, 0.1);
		box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.16);
		max-width: 14rem;
	}
</style>
