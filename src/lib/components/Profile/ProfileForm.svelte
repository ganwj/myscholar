<script>
	import { enhance } from '$app/forms';

	/**
	 * @type {any}
	 */
	export let form;
	/**
	 * @type {any}
	 */
	export let user;
	let submitting = false;

	$: if (form && form.success === false) {
		submitting = false;
	}

	function submitForm() {
		submitting = true;
	}

	let levels = [
		'Pre-University',
		'Foundation',
		'Diploma',
		'Undergraduate Degree',
		'Postgraduate',
		'Masters',
		'PhD'
	];
	let countries = ['Malaysia', 'Overseas'];
	let programs = [
		'ACCA',

		'A-Levels',

		'Accounting',

		'Business',

		'Communication',

		'Dentistry',

		'Design',

		'Education',

		'Engineering',

		'Foundation',

		'Foundation in Arts',

		'Foundation in Business',

		'Foundation in Science',

		'Information Technology',

		'Law',

		'MBBS',

		'Medicine',

		'Nursing',

		'Pharmacy',

		'Software Engineering',

		'Psychology'
	];
</script>

<div id="main" class="lg:flex-1 lg:max-w-md lg:pb-14 lg:pt-10 p-4">
	<h2 class="text-lg font-bold mb-10">{user.hasProfile ? 'Edit profile' : 'Create profile'}</h2>
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
				value={user.hasProfile ? user.name : ''}
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
				value={user.hasProfile ? user.email : ''}
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
				value={user.hasProfile ? user.program : ''}
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
					<option value={program}>{program}</option>
				{/each}
			</select>
		</div>
		<div class="mb-4 flex flex-col">
			<label for="level">Level of study</label>
			<select
				id="level"
				name="level"
				value={user.hasProfile ? user.level : ''}
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
					<option value={level}>{level}</option>
				{/each}
			</select>
		</div>
		<div class="mb-4 flex flex-col">
			<label for="country">Country</label>
			<select
				id="country"
				name="country"
				value={user.hasProfile ? user.country : ''}
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
					<option value={country}>{country}</option>
				{/each}
			</select>
		</div>
		<div class="mt-9">
			<button
				disabled={submitting}
				type="submit"
				class="text-center rounded focus:outline-none focus:ring whitespace-nowrap bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-800 disabled:bg-primary-600 disabled:text-white disabled:cursor-not-allowed text-base h-12 leading-[3rem] px-8 grow basis-1/2"
				>{user.hasProfile ? 'Update profile' : 'Create profile'}
			</button>
		</div>
	</form>
</div>

<style>
	.is-invalid,
	.is-invalid:focus {
		border-color: rgb(220 38 38);
	}
</style>
