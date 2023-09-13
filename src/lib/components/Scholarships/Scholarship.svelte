<script>
	import { Badge, Card } from 'flowbite-svelte';
	import { BookSolid } from 'flowbite-svelte-icons';
	import { StairsSolid } from 'svelte-awesome-icons';
	import { P } from 'flowbite-svelte';
	/**
	 * @type {any}
	 */
	export let scholarship;
	let hcard = false;
</script>

<div class="scholarship-list">
	<Card
		href="/scholarship-detail/{scholarship.id}"
		class="horizontal reverse={hcard} relative items-center md:grid grid-cols-5 gap-10 md:mb-5 md:max-w-2xl"
	>
		<div class="image-box mt-8 col-span-2 md:mt-0">
			<div class="flex items-center justify-center">
				<img src={scholarship.imageURL} alt="Institution logo" class="w-full" />
			</div>
		</div>
		{#if scholarship.interview === 'no'}
			<div class="interview-info left-0 md:top-5">
				<span>No Interview</span>
			</div>
		{/if}
		<div class="scholarship-detail col-span-3">
			<h3 class="mb-2 text-lg font-bold tracking-tight text-gray-800 dark:text-white">
				{scholarship.name}
			</h3>
			<div>
				<Badge color="red">{scholarship.country}</Badge>
				{#each scholarship.type as type}
					<Badge color="green" class="mr-1">{type}</Badge>
				{/each}
			</div>
			<P class="my-3 text-sm font-normal text-gray-700 dark:text-gray-400 leading-tight">
				{scholarship.description}
			</P>
			<P class="mb-3 text-md font-semibold text-gray-800 dark:text-gray-400 leading-tight">
				Applicable For:
			</P>
			<div class="bottom-detail text-gray-700">
				<div class="scholarship-course">
					<StairsSolid color="#991b1b" size="18" class="mr-1.5" />
					<span>{scholarship.course_level}</span>
				</div>
				<div class="scholarship-field">
					<BookSolid color="#991b1b" size="sm" class="mr-1.5" />
					<span>{scholarship.field_of_study}</span>
				</div>
			</div>
		</div>
	</Card>
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

	.scholarship-list {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.scholarship-course,
	.scholarship-field,
	.bottom-detail {
		display: flex;
		align-items: center;
	}

	.bottom-detail {
		gap: 15px;
		flex-wrap: wrap;
	}

	.bottom-detail span {
		font-size: 0.9rem;
	}

	.image-box {
		border: 2px solid rgba(0, 0, 0, 0.1);
		box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.16);
		max-width: 14rem;
		max-height: 14rem;
	}
</style>
