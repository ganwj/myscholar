<script>
	import { page } from '$app/stores';

	export let data;
	$: activeUrl = $page.url.pathname;
</script>

<div class="w-full flex-auto mt-2">
	<main class="mx-auto max-w-5xl">
		<div class=" lg:gap-10 lg:px-4 lg:flex lg:columns-3">
			<div class="hidden lg:w-[17.625rem] lg:flex-none lg:block lg:mt-6">
				<aside class="rounded-md border border-gray-200">
					<h3 class="rounded-t-md bg-gray-200 px-6 py-3 font-bold">My account</h3>
					<ul class="pb-8">
						<li class="group px-6">
							<a
								href={data.user && data.user.hasProfile ? '/profile/pa' : '/profile/edit'}
								class={activeUrl.indexOf('/profile/pa') > -1 ||
								activeUrl.indexOf('/profile/edit') > -1
									? 'text-sm font-bold text-primary-700'
									: 'text-sm hover:underline'}
							>
								<span
									class={activeUrl.indexOf('/profile/pa') > -1 ||
									activeUrl.indexOf('/profile/edit') > -1
										? 'block pb-2 pt-4 border-b-2 border-primary-700'
										: 'block pb-2 pt-4 border-b border-gray-200'}>Profile</span
								>
							</a>
						</li>
						<li class="group px-6">
							<a
								href="/profile/scholarships"
								class={activeUrl === '/profile/scholarships'
									? 'text-sm font-bold text-primary-700'
									: 'text-sm hover:underline'}
							>
								<span
									class={activeUrl === '/profile/scholarships'
										? 'block pb-2 pt-4 border-b-2 border-primary-700'
										: 'block pb-2 pt-4 border-b border-gray-200'}>My scholarships</span
								>
							</a>
						</li>
					</ul>
				</aside>
			</div>
			<div class="flex lg:hidden">
				<div class="flex grow justify-between border-b border-b-gray-100">
					<div class="flex-1 text-center">
						<a
							href={data.user && data.user.hasProfile ? '/profile/pa' : '/profile/edit'}
							class={activeUrl.indexOf('/profile/pa') > -1 ||
							activeUrl.indexOf('/profile/edit') > -1
								? 'text-sm font-bold text-primary-700'
								: 'text-sm hover:underline'}
						>
							<span
								class={activeUrl.indexOf('/profile/pa') > -1 ||
								activeUrl.indexOf('/profile/edit') > -1
									? 'flex justify-center pb-2 pt-4 border-b-2 border-primary-700'
									: 'flex justify-center pb-2 pt-4 border-gray-200'}>Profile</span
							>
						</a>
					</div>
					<div class="flex-1 text-center">
						<a
							href="/profile/scholarships"
							class={activeUrl === '/profile/scholarships'
								? 'text-sm font-bold text-primary-700'
								: 'text-sm hover:underline'}
						>
							<span
								class={activeUrl === '/profile/scholarships'
									? 'flex justify-center pb-2 pt-4 border-b-2 border-primary-700'
									: 'flex justify-center pb-2 pt-4 border-gray-200'}>My scholarships</span
							>
						</a>
					</div>
				</div>
			</div>
			<slot />
		</div>
	</main>
</div>
