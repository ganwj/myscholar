<script>
	import { enhance } from '$app/forms';

	/**
	 * @type {any}
	 */
	export let form;
	/**
	 * @type {string}
	 */
	export let text;
	let submitting = false;

	$: if (form && form.success === false) {
		submitting = false;
	}

	function submitForm() {
		submitting = true;
	}

	let levels = [
		{
			id: 1,
			text: 'Pre-University'
		},
		{
			id: 2,
			text: 'Foundation'
		},
		{
			id: 3,
			text: 'Diploma'
		},
		{
			id: 4,
			text: 'Undergraduate Degree'
		},
		{
			id: 5,
			text: 'Postgraduate'
		},
		{
			id: 6,
			text: 'Masters'
		},
		{
			id: 7,
			text: 'PhD'
		}
	];
	let countries = [
		{
			id: 1,
			text: 'Local'
		},
		{
			id: 2,
			text: 'Overseas'
		}
	];
	let programs = [
		{
			id: 1,
			text: 'ACCA'
		},
		{
			id: 2,
			text: 'A-Levels'
		},
		{
			id: 3,
			text: 'Accounting'
		},
		{
			id: 4,
			text: 'Business'
		},
		{
			id: 5,
			text: 'Communication'
		},
		{
			id: 6,
			text: 'Dentistry'
		},
		{
			id: 7,
			text: 'Design'
		},
		{
			id: 8,
			text: 'Education'
		},
		{
			id: 9,
			text: 'Engineering'
		},
		{
			id: 10,
			text: 'Foundatiom'
		},
		{
			id: 11,
			text: 'Foundation in Arts'
		},
		{
			id: 12,
			text: 'Foundation in Business'
		},
		{
			id: 13,
			text: 'Foundation in Science'
		},
		{
			id: 14,
			text: 'Information Technology'
		},
		{
			id: 15,
			text: 'Law'
		},
		{
			id: 16,
			text: 'MBBS'
		},
		{
			id: 17,
			text: 'Medicine'
		},
		{
			id: 18,
			text: 'Nursing'
		},
		{
			id: 19,
			text: 'Pharmacy'
		},
		{
			id: 20,
			text: 'Software Engineering'
		},
		{
			id: 21,
			text: 'Psychology'
		}
	];
</script>

<div id="main" class="lg:flex-1 lg:max-w-md lg:pb-14 lg:pt-10 p-4">
	<h2 class="text-lg font-bold mb-10">{text}</h2>
	<form
		method="post"
		use:enhance
		enctype="multipart/form-data"
		action="/profile/edit"
		id="edit-profile"
		on:submit={submitForm}
	>
		<div class="mb-4 flex flex-col">
			<label for="name">Name</label>
			<input
				type="text"
				id="name"
				name="name"
				class:is-invalid={form?.error_name}
				class="
                    border rounded h-12 pl-4
                    text-gray-900 text-base
                    placeholder:text-gray-600
                    focus:ring-0
                    disabled:bg-gray-50 disabled:border-primary-200 disabled:cursor-not-allowed
                    border-gray-400 focus:border-primary-700
                "
			/>
			{#if form?.error_name}
				<span class="text-red-600 mt-1 text-sm">{form?.error_name}</span>
			{/if}
		</div>
		<div class="mb-4 flex flex-col">
			<label for="email">Email address</label>
			<input
				type="text"
				id="email"
				name="email"
				class:is-invalid={form?.error_email}
				class="
                    border rounded h-12 pl-4
                    text-gray-900 text-base
                    placeholder:text-gray-600
                    focus:ring-0
                    disabled:bg-gray-50 disabled:border-primary-200 disabled:cursor-not-allowed
                    border-gray-400 focus:border-primary-700
                "
			/>
			{#if form?.error_email}
				<span class="text-red-600 mt-1 text-sm">{form?.error_email}</span>
			{/if}
		</div>
		<div class="mb-4 flex flex-col">
			<label for="program">Programme</label>
			<select
				id="program"
				name="program"
				class="
                    border rounded h-12 pl-4
                    text-gray-900 text-base
                    placeholder:text-gray-600
                    focus:ring-0
                    disabled:bg-gray-50 disabled:border-primary-200 disabled:cursor-not-allowed
                    border-gray-400 focus:border-primary-700
                "
			>
				{#each programs as program}
					<option value={program}>{program.text}</option>
				{/each}
			</select>
		</div>
		<div class="mb-4 flex flex-col">
			<label for="level">Level of study</label>
			<select
				id="level"
				name="level"
				class="
                    border rounded h-12 pl-4
                    text-gray-900 text-base
                    placeholder:text-gray-600
                    focus:ring-0
                    disabled:bg-gray-50 disabled:border-primary-200 disabled:cursor-not-allowed
                    border-gray-400 focus:border-primary-700
                "
			>
				{#each levels as level}
					<option value={level}>{level.text}</option>
				{/each}
			</select>
		</div>
		<div class="mb-4 flex flex-col">
			<label for="country">Country</label>
			<select
				id="country"
				name="country"
				class="
                    border rounded h-12 pl-4
                    text-gray-900 text-base
                    placeholder:text-gray-600
                    focus:ring-0
                    disabled:bg-gray-50 disabled:border-primary-200 disabled:cursor-not-allowed
                    border-gray-400 focus:border-primary-700
                "
			>
				{#each countries as country}
					<option value={country}>{country.text}</option>
				{/each}
			</select>
		</div>
		<div class="mt-9">
			<button
				disabled={submitting}
				type="submit"
				class="text-center rounded focus:outline-none focus:ring whitespace-nowrap bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-800 disabled:bg-primary-600 disabled:text-white disabled:cursor-not-allowed text-base h-12 leading-[3rem] px-8 grow basis-1/2"
				>Create profile</button
			>
		</div>
	</form>
</div>

<style>
	.is-invalid,
	.is-invalid:focus {
		border-color: rgb(220 38 38);
	}
</style>
