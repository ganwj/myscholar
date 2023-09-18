<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Scholarship from '$lib/components/Scholarships/Scholarship.svelte';
	import messagesStore from '$lib/stores/messages.store.js';
	import { Button, Pagination } from 'flowbite-svelte';
	import {
		ChervonDoubleLeftSolid,
		ChervonDoubleRightSolid,
		SearchOutline
	} from 'flowbite-svelte-icons';
	import '@algolia/autocomplete-theme-classic';
	import { autocomplete } from '@algolia/autocomplete-js';
	import algoliasearch from 'algoliasearch';
	import { PUBLIC_ALGOLIA_API_KEY, PUBLIC_ALGOLIA_APPLICATION_ID } from '$env/static/public';
	import { onMount } from 'svelte';
	import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
	import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
	import instantsearch from 'instantsearch.js';
	import { refinementList } from 'instantsearch.js/es/widgets';
	import { createDropdown } from '$lib/components/Dropdown/Dropdown.js';
	import 'instantsearch.css/themes/satellite.css';
	import '$lib/components/Dropdown/Dropdown.css';

	export let data;
	$: activeUrl = $page.url.searchParams.get('page');
	/**
	 * @type import('flowbite-svelte').LinkType[]
	 */
	let pages;
	/**
	 * @type {HTMLDivElement}
	 */
	let searchDiv;

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
		/**
		 * @type {HTMLInputElement | null}
		 */
		const input = searchDiv.querySelector('.aa-Input');
		if (input) {
			const query = input.value;
			const params = new URLSearchParams($page.url.search);
			params.set('page', '1');
			params.set('q', query);
			await goto('/scholarships/?' + params.toString());
		}
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

	onMount(() => {
		searchDiv.addEventListener('keypress', function (event) {
			if (event.key === 'Enter') {
				search();
			}
		});

		const client = algoliasearch(PUBLIC_ALGOLIA_APPLICATION_ID, PUBLIC_ALGOLIA_API_KEY);

		const instantSearch = instantsearch({
			indexName: 'scholarships_new',
			searchClient: client
		});

		const refinementListDropdown = createDropdown(refinementList);

		instantSearch.addWidgets([
			refinementListDropdown({
				container: '#institution',
				attribute: 'institution',
				searchable: true,
				limit: 80
			})
		]);

		instantSearch.start();

		const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
			key: 'RECENT_SEARCH',
			limit: 4,
			transformSource({ source }) {
				/**
				 * @param {import("@algolia/autocomplete-plugin-recent-searches/dist/esm/types/RecentSearchesItem.js").RecentSearchesItem} item
				 */
				function createUrl(item) {
					const urlParams = new URLSearchParams($page.url.search);
					urlParams.set('page', '1');
					urlParams.set('q', item.label);

					return `scholarships/?${urlParams.toString()}`;
				}

				return {
					...source,
					getItemUrl({ item }) {
						return createUrl(item);
					},
					templates: {
						item(params) {
							const { item, html } = params;

							return html`<a class="aa-ItemLink" href="${createUrl(item)}">
								${
									// @ts-ignore
									source.templates.item(params).props.children
								}
							</a>`;
						},
						noResults() {
							return 'No results.';
						}
					}
				};
			}
		});

		const querySuggestionsPlugin = createQuerySuggestionsPlugin({
			searchClient: client,
			indexName: 'scholarships_query_suggestions',
			getSearchParams() {
				// @ts-ignore
				return recentSearchesPlugin.data.getAlgoliaSearchParams({
					hitsPerPage: 8
				});
			},
			transformSource({ source }) {
				/**
				 * @param {import("@algolia/autocomplete-plugin-query-suggestions/dist/esm/types/QuerySuggestionsHit.js").AutocompleteQuerySuggestionsHit} item
				 */
				function createUrl(item) {
					const urlParams = new URLSearchParams($page.url.search);
					urlParams.set('page', '1');
					urlParams.set('q', item.query);

					return `scholarships/?${urlParams.toString()}`;
				}

				return {
					...source,
					getItemUrl({ item }) {
						return createUrl(item);
					},
					templates: {
						item(params) {
							const { item, html } = params;

							return html`<a class="aa-ItemLink" href="${createUrl(item)}">
								${
									// @ts-ignore
									source.templates.item(params).props.children
								}
							</a>`;
						}
					}
				};
			}
		});

		autocomplete({
			container: '#autocomplete',
			plugins: [recentSearchesPlugin, querySuggestionsPlugin],
			placeholder: 'Search for scholarships',
			openOnFocus: true,
			navigator: {
				async navigate({ itemUrl }) {
					await goto(itemUrl);
				},
				navigateNewTab({ itemUrl }) {
					const windowReference = window.open(itemUrl, '_blank', 'noopener');

					if (windowReference) {
						windowReference.focus();
					}
				},
				navigateNewWindow({ itemUrl }) {
					window.open(itemUrl, '_blank', 'noopener');
				}
			},
			detachedMediaQuery: 'none'
		});
	});
</script>

<div class="search-panel flex justify-center h-36 shadow-md md:h-40">
	<div class="wrapper w-10/12 md:w-8/12 lg:w-7/12">
		<div class="search-bar flex flex-row items-center mt-5 gap-5 md:mt-7">
			<div
				role="searchbox"
				id="autocomplete"
				tabindex="0"
				bind:this={searchDiv}
				class="basis-full lg:basis-10/12"
			></div>
			<Button class="hidden lg:block" on:click={search}>Search</Button>
		</div>
		<div class="search-panel-filters relative mt-5">
			<div id="institution">
				<div class="ais-Panel ais-Dropdown ais-Panel--noRefinement">
					<div class="ais-Panel-header">
						<span>
							<button type="button" class="ais-Dropdown-button"></button>
						</span>
					</div>
					<div class="ais-Panel-body"></div>
					<div class="ais-Panel-footer">
						<button type="button" class="ais-Dropdown-close">Apply</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="results w-10/12 mx-auto py-5 mt-3 md:w-full lg:mt-5">
	{#if data.scholarships.length > 0}
		<div class="results-header md:ml-20 lg:ml-52">
			{#if $page.url.searchParams.get('q') === '' || $page.url.searchParams.get('q') === null}
				<p><strong>all scholarships</strong></p>
			{:else}
				<p><strong>{$page.url.searchParams.get('q')}</strong> scholarships</p>
			{/if}
			<p class="mt-3 mb-8">
				<strong>{data.totalScholarships}</strong> scholarships - Page <strong>{data.page}</strong>
				of
				<strong>{data.totalPages}</strong>
			</p>
		</div>
		{#each data.scholarships as scholarship (scholarship.id)}
			<div class="flex flex-col items-center justify-center">
				<Scholarship {scholarship} />
			</div>
		{/each}
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
		<div class="text-sm mt-2 ml-2 md:text-base">
			<div class="flex flex-row gap-2.5 items-center">
				<SearchOutline class="text-primary-700 w-4 h-4" />
				<p class="text-l font-bold">We couldn't find any scholarships that matched your search.</p>
			</div>
			<p class="my-5">Please try the following:</p>
			<ul class="list-disc list-outside ml-4">
				<li>Make sure all words are spelled correctly</li>
				<li class="mt-2">Try different, or more general keywords</li>
				<li class="mt-2">Change or remove filters</li>
			</ul>
		</div>
	{/if}
</div>
