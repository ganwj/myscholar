<script>
	import { goto } from '$app/navigation';
	import { EditOutline } from 'flowbite-svelte-icons';

	export let data;

	async function getPersonalizedScholarships() {
		await goto('/personalized-scholarships');
	}
</script>

<div id="main" class="lg:flex-1 lg:max-w-md lg:pb-14 lg:pt-14 lg:pl-32 p-4">
	<div class="space-y-4 ml-12 mt-5 lg:ml-0 lg:mt-0">
		<div class="relative">
			<div class="mb-12 flex items-center justify-center">
				<div
					class="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-white text-green-700 shadow-lg"
				>
					{data.user?.name.charAt(0).toUpperCase()}
				</div>
			</div>
			<div class="space-y-3">
				<div class="max-w-full flex">
					<div class="flex grow flex-col overflow-x-clip">
						<div class="leading-4 text-base text-gray-900 truncate">
							<p class="text-lg font-bold">{data.user?.name}</p>
						</div>
					</div>
				</div>
				<div class="max-w-full flex">
					<div class="flex grow flex-col overflow-x-clip">
						<div class="leading-4 text-base text-gray-900">
							{data.user?.email}
						</div>
					</div>
				</div>
				<div class="max-w-full flex">
					<div class="flex grow flex-col overflow-x-clip">
						<div class="leading-4 text-base text-gray-900">
							{data.user?.country}
						</div>
					</div>
				</div>
				<div class="max-w-full flex">
					<div class="flex grow flex-col overflow-x-clip">
						<div class="leading-4 text-base text-gray-900">
							{data.user?.level}
						</div>
					</div>
				</div>
				<div class="max-w-full flex">
					<div class="flex grow flex-col overflow-x-clip">
						<div class="leading-4 text-base text-gray-900">
							{data.user?.program}
						</div>
					</div>
				</div>
			</div>
			<div class="mt-14">
				<button
					type="button"
					on:click={getPersonalizedScholarships}
					class="text-center rounded focus:outline-none focus:ring whitespace-nowrap bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-800 disabled:bg-primary-600 disabled:text-white disabled:cursor-not-allowed text-base h-12 leading-[3rem] px-6"
					>Get personalized scholarships</button
				>
			</div>
			<a
				href="/profile/edit"
				class="absolute right-5 top-0 flex h-10 w-10 items-center justify-center rounded-full lg:-right-20 lg:top-2"
			>
				<EditOutline class="w-8 h-8" ariaLabel="Edit profile" strokeWidth="0.75" />
			</a>
		</div>
	</div>
</div>
