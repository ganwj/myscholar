<script>
	import { Button } from 'flowbite-svelte';
	import {
		BookOutline,
		ChevronLeftOutline,
		ChevronRightOutline,
		LandmarkOutline,
		MapLocationOutline
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	export let data;

	let currentIndex = 0;
	/**
	 * @type {HTMLDivElement}
	 */
	let stage;
	/**
	 * @type {HTMLDivElement}
	 */
	let root;
	let noOfTables = 0;

	/**
	 * @param {number} index
	 */
	function goToTable(index) {
		if (index < 0 || index >= noOfTables) {
			return;
		}
		currentIndex = index;
		const translateX = -currentIndex * 100; // Each table takes 100% width
		stage.style.transform = `translateX(${translateX}%)`;
	}

	function goToNextTable() {
		goToTable(currentIndex + 1);
	}

	function goToPreviousTable() {
		goToTable(currentIndex - 1);
	}

	onMount(() => {
		const tables = root.querySelectorAll('.awards-table');
		noOfTables = tables.length;

		if (stage && noOfTables > 0) {
			goToTable(currentIndex);
		}
	});
</script>

<div bind:this={root} class="w-11/12 mx-auto my-10 text-sm md:text-base md:w-10/12 lg:w-7/12">
	<div class="flex flex-col">
		<div class="flex flex-col lg:flex-none">
			<div class="flex">
				<div class="flex items-center justify-center image-box mr-9 md:basis-8/12 lg:mr-8">
					<img src={data.scholarship.imageURL} alt="Institution logo" />
				</div>
				<div class="lg:flex lg:flex-col lg:justify-between">
					<h4 class="font-semibold text-xl text-red-800 md:text-2xl">{data.scholarship.name}</h4>
					<div
						class="details-awards text-red-800 font-medium mt-10 text-center text-l hidden lg:text-xl lg:block"
					>
						<span>{data.scholarship.waiver}</span>
					</div>
				</div>
			</div>
			<div class="details-awards text-red-800 font-semibold mt-10 text-center text-xl lg:hidden">
				<span>{data.scholarship.waiver}</span>
			</div>
		</div>
		<div class="my-8">
			<div class="flex flex-row mt-2">
				<div
					class="flex flex-row items-center gap-2 grow-0 shrink-0 basis-4/12 md:basis-3/12 md:gap-3 lg:gap-4"
				>
					<MapLocationOutline
						size="sm"
						strokeWidth="1"
						class="w-4 h-4 text-red-800 md:w-5 md:h-5"
					/>
					<span>Location:</span>
				</div>
				<span>{data.scholarship.institution}</span>
			</div>
			<div class="flex flex-row mt-4">
				<div
					class="flex flex-row items-center gap-2 grow-0 shrink-0 basis-4/12 md:basis-3/12 md:gap-3 lg:gap-4"
				>
					<LandmarkOutline strokeWidth="1" class="w-4 h-4 text-red-800 md:w-5 md:h-5" />
					<span>Course Level:</span>
				</div>
				<span>{data.scholarship.course_level}</span>
			</div>
			<div class="flex flex-row mt-4">
				<div
					class="flex flex-row items-center gap-2 grow-0 shrink-0 basis-4/12 md:basis-3/12 md:gap-3 lg:gap-4"
				>
					<BookOutline strokeWidth="1" class="w-4 h-4 text-red-800 md:w-5 md:h-5" />
					<span>Field of Study:</span>
				</div>
				<span>{data.scholarship.field_of_study}</span>
			</div>
		</div>
		<section class="criteria mb-8 lg:mb-10">
			<h4 class="font-medium text-3xl text-red-800 mb-2">Criteria</h4>
			<hr />
			<div class="mt-5 ml-10 md:ml-14">
				<ul class="list-disc list-outside leading-normal">
					{#each data.scholarship.criteria as criterion}
						<li>{criterion}</li>
						<div class="w-full mb-4 md:mb-3"></div>
					{/each}
				</ul>
			</div>
		</section>
		<section class="highlight mb-8 lg:mb-10">
			<h4 class="font-medium text-3xl text-red-800 mb-2">Highlights</h4>
			<hr />
			<div class="mt-5 ml-10 md:ml-14">
				<ul class="list-disc list-outside leading-normal">
					{#each data.scholarship.highlights as highlight}
						<li>{highlight}</li>
						<div class="w-full mb-4 md:mb-3"></div>
					{/each}
				</ul>
			</div>
		</section>
		<section class="awards mb-8 lg:mb-10">
			<h4 class="font-medium text-3xl text-red-800 mb-2">Awards</h4>
			<hr />
			<div class="mt-5 ml-10 md:ml-14">
				<ul class="list-disc list-outside leading-normal">
					{#each data.scholarship.awards as award}
						<li>{award}</li>
						<div class="w-full mb-4 md:mb-3"></div>
					{/each}
				</ul>
			</div>
			{#if data.scholarship.amount_matching.length > 0}
				<div class="awards-container mt-8 border border-red-800 relative lg:mt-5">
					<div class="outer-stage overflow-hidden">
						{#if data.scholarship.amount_matching.length > 1}
							<ChevronLeftOutline
								strokeWidth="1"
								size="xs"
								role="button"
								class="text-red-800 absolute top-1/2 left-2.5 z-50"
								on:click={goToPreviousTable}
							/>
							<ChevronRightOutline
								strokeWidth="1"
								size="xs"
								role="button"
								class="text-red-800 absolute top-1/2 right-2.5 z-50"
								on:click={goToNextTable}
							/>
						{/if}
						<div bind:this={stage} class="stage flex">
							{#each data.scholarship.amount_matching as table}
								<div class="awards-table basis-full shrink-0 mt-2">
									<div class="flex justify-center">
										<div class="table-container">
											<span class="text-red-800 font-medium text-xl">{table.title}</span>
											<div class="prize-list mt-3 px-3">
												{#each table.items as item}
													<div class="grid grid-cols-7 gap-x-2 md:gap-x-10">
														<span class="font-medium col-span-3">{item.result}</span>
														<span class="col-span-4">{item.amount}</span>
													</div>
													<div class="w-full mb-1"></div>
												{/each}
											</div>
											<div class="remarks mb-2 mt-3 px-3 md:mt-5">
												<span>{table.remarks}</span>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</section>
		<section class="details mb-8 lg:mb-10">
			<h4 class="font-medium text-3xl text-red-800 mb-2">Details</h4>
			<hr />
			<div class="mt-5 ml-10 md:ml-14">
				<ul class="list-disc list-outside leading-normal">
					{#each data.scholarship.details as detail}
						<li>{detail}</li>
						<div class="w-full mb-4 md:mb-3"></div>
					{/each}
				</ul>
			</div>
		</section>
		<section class="application mb-6">
			<h4 class="font-medium text-3xl text-red-800 mb-2">Application</h4>
			<hr />
			<div class="mt-5 ml-10 md:ml-14">
				<ul class="list-disc list-outside leading-normal">
					{#each data.scholarship.application as application}
						<li>{application}</li>
						<div class="w-full mb-4 md:mb-3"></div>
					{/each}
				</ul>
			</div>
		</section>
		<Button
			class="bg-red-800 w-7/12 hover:bg-red-900 focus:ring-0 md:ml-3 md:w-4/12 lg:w-3/12 lg:ml-2"
			href={data.scholarship.url}>Apply for scholarship</Button
		>
	</div>
</div>

<style>
	.image-box {
		border: 2px solid rgba(0, 0, 0, 0.1);
		box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.16);
		max-width: 14rem;
		max-height: 14rem;
	}

	.awards-container {
		background-color: rgb(251, 251, 251);
	}

	.details-awards {
		/* background-color: #fbfbfb; */
		background-color: #f1f5f9;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
		padding: 20px 40px;
	}

	.stage {
		transition: transform 0.5s ease-in-out;
	}
</style>
