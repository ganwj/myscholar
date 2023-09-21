<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Scholarship from '$lib/components/Scholarship/Scholarship.svelte';
	import messagesStore from '$lib/stores/messages.store.js';
	import { Pagination } from 'flowbite-svelte';
	import {
		ChervonDoubleLeftSolid,
		ChervonDoubleRightSolid,
		SearchOutline
	} from 'flowbite-svelte-icons';

	export let data;
	$: activeUrl = $page.url.searchParams.get('page');
	/**
	 * @type import('flowbite-svelte').LinkType[]
	 */
	let pages;

	$: {
		pages = [];
		const params = new URLSearchParams($page.url.search);
		for (
			let i = +data.page === 1 || +data.page === 2 ? +data.page : +data.page - 2;
			i <= +data.page + 5;
			i++
		) {
			// @ts-ignore
			if (i > +data.totalPages) {
				break;
			}

			params.set('page', i.toString());

			const item = {
				name: i.toString(),
				href: '/personalized-scholarships/?' + params.toString()
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
			const params = new URLSearchParams($page.url.search);
			params.set('page', '1');
			await goto('/personalized-scholarships/?' + params.toString());
		} catch (e) {
			messagesStore.showError();
		}
	}

	async function toLast() {
		try {
			const params = new URLSearchParams($page.url.search);
			params.set('page', `${data.totalPages}`);
			await goto('/personalized-scholarships/?' + params.toString());
		} catch (e) {
			messagesStore.showError();
		}
	}
</script>

<div class="results w-11/12 mx-auto py-5 mt-3 md:w-full lg:mt-5">
	{#if data.scholarships.length > 0}
		<div class="flex flex-col items-center">
			<div class="results-header mb-10 font-medium self-start md:ml-14 lg:ml-52">
				<p>We have found {data.totalScholarships} scholarships that you might be interested.</p>
			</div>
			{#each data.scholarships as scholarship (scholarship.id)}
				<Scholarship {scholarship} />
			{/each}
		</div>
		<div class="pagination my-3 text-center">
			<Pagination {pages} on:previous={toFirst} on:next={toLast}>
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
	{:else}
		<div class="text-sm mt-10 flex flex-col items-center md:text-base">
			<div class="flex flex-row gap-2.5 items-center">
				<SearchOutline class="text-primary-700 w-4 h-4" />
				<p class="text-l font-bold">
					We couldn't find any scholarships that matched your criteria.
				</p>
			</div>
			<p class="my-5">Please stay tuned for more scholarships to be added in the future!</p>
		</div>
	{/if}
</div>
