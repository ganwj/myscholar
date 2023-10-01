<script>
	import { Button } from 'flowbite-svelte';
</script>

<div class="header flex items-center justify-center">
	<div class="header-container w-9/12">
		<div class="header-inner w-11/12 md:w-10/12">
			<h1 class="font-bold text-2xl">Welcome to MyScholar</h1>
			<p class="mt-12">
				MyScholar is a platform designed to offer a unified and all-inclusive resource for Malaysian
				students seeking information on a wide range of scholarships for their educational pursuits.
				Its primary goal is to streamline and simplify the scholarship search process by
				consolidating all pertinent details into a single, easily accessible hub.
			</p>
			<Button size="lg" href="/scholarships" class="mt-14" color="primary"
				>Browse scholarships</Button
			>
		</div>
	</div>
</div>

<style>
	.header {
		height: 100vh;
		position: relative;
		background-image: linear-gradient(rgba(0, 0, 0, 0.85), rgba(34, 34, 34, 0.85)),
			url(/graduation.png);
		background-size: cover;
		color: #fff;
	}

	.header-container {
		position: absolute;
		left: 50%;
		top: 40%;
		transform: translate(-50%, -50%);
	}

	h1 {
		font-size: 28px;
		line-height: 1.15;
	}

	p {
		line-height: 1.6;
	}

	@media (min-width: 768px) {
		h1 {
			font-size: 32px;
		}

		.header-container {
			top: 30%;
		}
	}

	@media (min-width: 1024px) {
		.header-container {
			top: 40%;
		}
	}
</style>
