<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Scholarship from '$lib/components/Scholarships/Scholarship.svelte';
	import messagesStore from '$lib/stores/messages.store.js';
	import { Button, Pagination, Search } from 'flowbite-svelte';
	import { ChervonDoubleLeftSolid, ChervonDoubleRightSolid } from 'flowbite-svelte-icons';

	export let data;
	$: activeUrl = $page.url.searchParams.get('page');
	/**
	 * @type import('flowbite-svelte').LinkType[]
	 */
	let pages;
	let query = '';

	$: {
		pages = [];
		const params = new URLSearchParams($page.url.search);
		for (let i = +data.page === 1 ? +data.page : +data.page - 1; i <= +data.page + 4; i++) {
			// @ts-ignore
			if (i > +data.totalPages) {
				break;
			}

			params.set('page', i.toString());

			const item = {
				name: i.toString(),
				href: '/scholarships/?' + params.toString()
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

	async function search() {
		const params = new URLSearchParams($page.url.search);
		params.set('page', '1');
		params.set('q', query);
		await goto('/scholarships/?' + params.toString());
	}

	async function toFirst() {
		try {
			const params = new URLSearchParams($page.url.search);
			params.set('page', '1');
			await goto('/scholarships/?' + params.toString());
		} catch (e) {
			messagesStore.showError();
		}
	}

	async function toLast() {
		try {
			const params = new URLSearchParams($page.url.search);
			params.set('page', `${data.totalPages}`);
			await goto('/scholarships/?' + params.toString());
		} catch (e) {
			messagesStore.showError();
		}
	}

	/**
	 * @param {{ key: string; }} event
	 */
	function keyPress(event) {
		if (event.key === 'Enter') {
			search();
		}
	}
</script>

<div class="search-header block h-40 shadow-md">
	<div class="w-6/12 mx-auto mt-5">
		<Search bind:value={query} on:keypress={keyPress}>
			<Button on:click={search}>Search scholarships</Button>
		</Search>
	</div>
</div>
<div class="w-10/12 mx-auto scholarships-container py-5 mt-5 md:11/12">
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
