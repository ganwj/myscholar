<script>
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { EditOutline } from 'flowbite-svelte-icons';

	export let data;

	async function getPersonalizedScholarships() {
		await goto('/personalized-scholarships');
	}
</script>

<div id="main" class="flex justify-center mt-16 max-w-5xl lg:mt-0 lg:flex-1 lg:max-w-md lg:py-14">
	<div class="space-y-4">
		<div class="relative">
			<div class="mb-12 flex items-center justify-center">
				<div
					class="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-white text-green-700 shadow-lg"
				>
					{data.user?.name?.charAt(0).toUpperCase()}
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
				<Button on:click={getPersonalizedScholarships} color="primary"
					>Get personalized scholarships</Button
				>
			</div>
			<a
				href="/profile/edit"
				class="absolute -right-3 top-0 flex items-center justify-center lg:-right-20 lg:top-0.5"
			>
				<EditOutline class="w-8 h-8" ariaLabel="Edit profile" strokeWidth="0.75" />
			</a>
		</div>
	</div>
</div>
