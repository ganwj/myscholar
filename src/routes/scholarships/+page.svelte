<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Scholarship from '$lib/components/Scholarships/Scholarship.svelte';
	import messagesStore from '$lib/stores/messages.store.js';
	import { Pagination } from 'flowbite-svelte';
	import { ChervonDoubleLeftSolid, ChervonDoubleRightSolid } from 'flowbite-svelte-icons';

	export let data;
	$: activeUrl = $page.url.searchParams.get('page');
	/**
	 * @type import('flowbite-svelte').LinkType[]
	 */
	let pages = [];

	$: {
		pages = [];
		for (let i = +data.page === 1 ? +data.page : +data.page - 1; i <= +data.page + 4; i++) {
			if (i > +data.totalPages) {
				break;
			}

			const item = {
				name: i.toString(),
				href: `/scholarships/?page=${+i}`
			};

			pages.push(item);
		}
	}

	$: {
		pages.forEach((page) => {
			// @ts-ignore
			let splitUrl = page.href.split('?');
			let queryString = splitUrl.slice(1).join('?');
			const hrefParams = new URLSearchParams(queryString);
			let hrefValue = hrefParams.get('page');
			if (hrefValue === activeUrl) {
				page.active = true;
			} else {
				page.active = false;
			}
		});
		pages = pages;
	}

	async function toFirst() {
		try {
			await goto('/scholarships/?page=1');
		} catch (e) {
			messagesStore.showError();
		}
	}

	async function toLast() {
		try {
			await goto(`/scholarships/?page=${+data.totalPages}`);
		} catch (e) {
			messagesStore.showError();
		}
	}
</script>

<div class="w-10/12 mx-auto scholarships-container py-5 mt-8 md:11/12">
	{#each data.scholarships as scholarship (scholarship.id)}
		<div class="mb-5 md:mb-0">
			<Scholarship {scholarship} />
		</div>
	{/each}

	<div class="pagination-container mt-3">
		<Pagination {pages} on:previous={toFirst} on:next={toLast} icon>
			<svelte:fragment slot="prev">
				<span class="sr-only">First</span>
				<ChervonDoubleLeftSolid class="w-2.5 h-2.5" />
			</svelte:fragment>
			<svelte:fragment slot="next">
				<span class="sr-only">Last</span>
				<ChervonDoubleRightSolid class="w-2.5 h-2.5" />
			</svelte:fragment>
		</Pagination>
	</div>
</div>

<style>
	.pagination-container {
		text-align: center;
	}
</style>
