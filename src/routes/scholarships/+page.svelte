<!-- <script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Scholarship from '$lib/components/Scholarship/Scholarship.svelte';
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

<div class="search-header w-screen  flex justify-center h-36 shadow-md md:h-40">
	<div class="search-panel w-10/12 md:w-8/12 lg:w-7/12">
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
</div> -->
<script>
	// @ts-nocheck
	import '@algolia/autocomplete-theme-classic';
	import 'instantsearch.css/themes/satellite.css';
	import '$lib/components/Dropdown/Dropdown.css';
	import '$lib/components/Scholarship/Scholarship.css';
	import '$lib/css/ScholarshipPage.css';
	import { autocomplete } from '@algolia/autocomplete-js';
	import algoliasearch from 'algoliasearch';
	import { PUBLIC_ALGOLIA_API_KEY, PUBLIC_ALGOLIA_APPLICATION_ID } from '$env/static/public';
	import { onMount } from 'svelte';
	import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
	import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
	import instantsearch from 'instantsearch.js';
	import { createDropdown } from '$lib/components/Dropdown/Dropdown.js';
	import historyRouter from 'instantsearch.js/es/lib/routers/history';
	import {
		refinementList,
		hits,
		pagination,
		stats,
		menuSelect,
		clearRefinements
	} from 'instantsearch.js/es/widgets';
	import connectSearchBox from 'instantsearch.js/es/connectors/search-box/connectSearchBox';

	onMount(() => {
		const searchClient = algoliasearch(PUBLIC_ALGOLIA_APPLICATION_ID, PUBLIC_ALGOLIA_API_KEY);
		const INSTANT_SEARCH_INDEX_NAME = 'scholarships_new';

		const instantSearchRouter = historyRouter();

		const search = instantsearch({
			searchClient,
			indexName: INSTANT_SEARCH_INDEX_NAME,
			routing: instantSearchRouter
		});

		// Mount a virtual search box to manipulate InstantSearch's `query` UI
		// state parameter.
		const virtualSearchBox = connectSearchBox(() => {});

		const refinementListDropdown = createDropdown(refinementList);
		const countryDropdown = createDropdown(menuSelect);
		const courseDropdown = createDropdown(refinementList, {
			buttonText({ items }) {
				const nbRefinements = (items || []).filter((item) => item.isRefined).length;
				return nbRefinements > 0 ? `Courses (${nbRefinements})` : 'Courses';
			}
		});
		const levelDropdown = createDropdown(menuSelect, {
			buttonText: 'Level'
		});
		const amountDropdown = createDropdown(menuSelect, {
			buttonText: 'Amount'
		});
		const categoryDropdown = createDropdown(menuSelect, {
			buttonText: 'Category'
		});
		const interviewDropdown = createDropdown(menuSelect);

		search.addWidgets([
			virtualSearchBox({}),
			refinementListDropdown({
				container: '#institution',
				attribute: 'institution',
				searchable: true,
				limit: 80,
				sortBy: ['isRefined', 'name:asc']
			}),
			hits({
				container: '#hits',
				templates: {
					item(hit, { html, components }) {
						return html`
							<a href="/scholarship-detail/${hit.objectID}" class="scholarship-wrapper">
								<div class="image-box">
									<img src=${hit.imageURL} alt="Institution logo" />
								</div>
								<div
									class="interview-info"
									style="display:${hit.interview === 'no' ? 'block' : 'none'}"
								>
									<span>No Interview</span>
								</div>
								<div class="scholarship-detail">
									<h3 class="title">${components.Highlight({ attribute: 'name', hit })}</h3>
									<div>
										<div class="badge-country">${hit.country}</div>
										${hit.type.map((type) => {
											return html`<div class="badge-type">${type}</div>`;
										})}
									</div>
									<p class="description">${hit.description}</p>
									<p class="applicable-for">Applicable For:</p>
									<div class="bottom-detail">
										<div class="scholarship-level">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="stairs-icon"
												role="img"
												width="18"
												height="18"
												fill="#991b1b"
												aria-label="stairs"
												viewBox="0 0 576 512"
											>
												<path
													d="M384 64c0-17.7 14.3-32 32-32H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H448v96c0 17.7-14.3 32-32 32H320v96c0 17.7-14.3 32-32 32H192v96c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h96V320c0-17.7 14.3-32 32-32h96V192c0-17.7 14.3-32 32-32h96V64z"
												></path>
											</svg>
											<span>${hit.course_level}</span>
										</div>
										<div class="scholarship-field">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="#991b1b"
												class="book-icon"
												role="img"
												aria-label="book solid"
												viewBox="0 0 16 20"
											>
												<path
													fill="#991b1b"
													d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z"
												></path>
											</svg>
											<span>${hit.field_of_study}</span>
										</div>
									</div>
								</div>
							</a>
						`;
					},
					empty(_results, { html }) {
						return html`<div class="no-hits">
							<div class="flex-helper">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									class="search-icon"
									role="img"
									aria-label="search outline"
									viewBox="0 0 20 20"
									_mstaria-label="236548"
									_mstHash="165"
								>
									<path
										stroke="#0f766e"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
									></path>
								</svg>
								<p>We couldn't find any scholarships that matched your search.</p>
							</div>
							<p>Please try the following:</p>
							<ul class="try-list">
								<li>Make sure all words are spelled correctly</li>
								<li style="margin-top: 0.5rem;">Try different, or more general keywords</li>
								<li style="margin-top: 0.5rem; margin-bottom: 4rem;">Change or remove filters</li>
							</ul>
						</div>`;
					}
				}
			}),
			pagination({
				container: '#pagination'
			}),
			stats({
				container: '#stats',
				templates: {
					text(data, { html }) {
						if (data.hasManyResults) {
							let query = '';
							if (data.query === '') {
								query = 'all';
							} else {
								query = data.query;
							}
							return html`
								<p><strong>${query}</strong> scholarships</p>
								<p style="margin-top:0.75rem; margin-bottom:2rem;">
									<strong>${data.nbHits}</strong> scholarships found in ${data.processingTimeMS}ms -
									Page
									<strong> ${data.page + 1} </strong>
									of
									<strong> ${data.nbPages}</strong>
								</p>
							`;
						}
					}
				}
			}),
			countryDropdown({
				container: '#country',
				attribute: 'country',
				sortBy: ['isRefined', 'count:desc']
			}),
			courseDropdown({
				container: '#course',
				attribute: 'field_of_study',
				searchable: true,
				limit: 100,
				sortBy: ['isRefined']
			}),
			levelDropdown({
				container: '#level',
				attribute: 'course_level',
				sortBy: ['isRefined', 'count:desc']
			}),
			amountDropdown({
				container: '#amount',
				attribute: 'waiver',
				sortBy: ['isRefined', 'count:desc'],
				transformItems(items) {
					return items.map((item) => ({
						...item,
						label:
							item.label.charAt(0) + item.label.slice(1, -3).toLowerCase() + item.label.slice(-3)
					}));
				}
			}),
			categoryDropdown({
				container: '#category',
				attribute: 'type',
				sortBy: ['isRefined', 'name:asc'],
				transformItems(items) {
					return items.map((item) => ({
						...item,
						label: item.label.charAt(0) + item.label.slice(1).toLowerCase()
					}));
				}
			}),
			interviewDropdown({
				container: '#interview',
				attribute: 'interview',
				sortBy: ['isRefined', 'name:asc'],
				transformItems(items) {
					return items.map((item) => ({
						...item,
						label: item.label.charAt(0).toUpperCase() + item.label.slice(1)
					}));
				}
			}),
			clearRefinements({
				container: '#reset'
			})
		]);

		// Set the InstantSearch index UI state from external events.
		function setInstantSearchUiState(indexUiState) {
			search.setUiState((uiState) => ({
				...uiState,
				[INSTANT_SEARCH_INDEX_NAME]: {
					...uiState[INSTANT_SEARCH_INDEX_NAME],
					// reset the page when the search state changes.
					page: 1,
					...indexUiState
				}
			}));
		}

		// Return the InstantSearch index UI state.
		function getInstantSearchUiState() {
			const uiState = instantSearchRouter.read();

			return (uiState && uiState[INSTANT_SEARCH_INDEX_NAME]) || {};
		}

		const searchPageState = getInstantSearchUiState();

		let skipInstantSearchUiStateUpdate = false;

		// This keeps Autocomplete aware of state changes coming from routing
		// and updates its query accordingly
		window.addEventListener('popstate', () => {
			skipInstantSearchUiStateUpdate = true;
			setQuery(search.helper?.state.query || '');
		});

		// Build URLs that InstantSearch understands.
		function getInstantSearchUrl(indexUiState) {
			return search.createURL({ [INSTANT_SEARCH_INDEX_NAME]: indexUiState });
		}

		search.start();

		// Detect when an event is modified with a special key to let the browser
		// trigger its default behavior.
		function isModifierEvent(event) {
			const isMiddleClick = event.button === 1;

			return isMiddleClick || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
		}

		function onSelect({ setIsOpen, setQuery, event, query }) {
			// You want to trigger the default browser behavior if the event is modified.
			if (isModifierEvent(event)) {
				return;
			}

			setQuery(query);
			setIsOpen(false);
			setInstantSearchUiState({ query });
		}

		function getItemUrl({ query }) {
			return getInstantSearchUrl({ query });
		}

		function createItemWrapperTemplate({ children, query, html }) {
			const uiState = { query };

			return html`<a
				class="aa-ItemLink"
				href="${getInstantSearchUrl(uiState)}"
				onClick="${(event) => {
					if (!isModifierEvent(event)) {
						// Bypass the original link behavior if there's no event modifier
						// to set the InstantSearch UI state without reloading the page.
						event.preventDefault();
					}
				}}"
			>
				${children}
			</a>`;
		}

		const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
			key: 'instantsearch',
			limit: 3,
			transformSource({ source }) {
				return {
					...source,
					getItemUrl({ item }) {
						return getItemUrl({
							query: item.label
						});
					},
					onSelect({ setIsOpen, setQuery, item, event }) {
						onSelect({
							setQuery,
							setIsOpen,
							event,
							query: item.label
						});
					},
					templates: {
						item(params) {
							const { children } = source.templates.item(params).props;

							return createItemWrapperTemplate({
								query: params.item.label,
								children,
								html: params.html
							});
						},
						noResults() {
							return 'No results.';
						}
					}
				};
			}
		});

		const querySuggestionsPlugin = createQuerySuggestionsPlugin({
			searchClient,
			indexName: 'scholarships_query_suggestions',
			getSearchParams() {
				return recentSearchesPlugin.data.getAlgoliaSearchParams({
					hitsPerPage: 6
				});
			},
			transformSource({ source }) {
				return {
					...source,
					sourceId: 'querySuggestionsPlugin',
					getItemUrl({ item }) {
						return getItemUrl({
							query: item.query
						});
					},
					onSelect({ setIsOpen, setQuery, event, item }) {
						onSelect({
							setQuery,
							setIsOpen,
							event,
							query: item.query
						});
					},
					getItems(params) {
						// Don't display Query Suggestions when there's no query.
						if (!params.state.query) {
							return [];
						}

						return source.getItems(params);
					},
					templates: {
						...source.templates,
						item(params) {
							const { children } = source.templates.item(params).props;

							return createItemWrapperTemplate({
								query: params.item.label,
								children,
								html: params.html
							});
						}
					}
				};
			}
		});

		function debounce(fn, time) {
			let timerId = undefined;

			return function (...args) {
				if (timerId) {
					clearTimeout(timerId);
				}

				timerId = setTimeout(() => fn(...args), time);
			};
		}

		const debouncedSetInstantSearchUiState = debounce(setInstantSearchUiState, 500);

		const { setQuery } = autocomplete({
			container: '#autocomplete',
			placeholder: 'Search for scholarships',
			detachedMediaQuery: 'none',
			initialState: {
				query: searchPageState.query || ''
			},
			onSubmit({ state }) {
				setInstantSearchUiState({ query: state.query });
			},
			onReset() {
				setInstantSearchUiState({ query: '' });
			},
			onStateChange({ prevState, state }) {
				if (!skipInstantSearchUiStateUpdate && prevState.query !== state.query) {
					debouncedSetInstantSearchUiState({ query: state.query });
				}
				skipInstantSearchUiStateUpdate = false;
			},
			openOnFocus: true,
			plugins: [recentSearchesPlugin, querySuggestionsPlugin]
		});
	});
</script>

<div class="search-header flex justify-center shadow-md">
	<div class="search-panel w-10/12 lg:w-8/12">
		<div id="autocomplete" class="mt-5 md:mt-7"></div>
		<div class="search-panel-filters text-sm relative mt-5">
			<div id="institution" class="inline-block mr-2 md:mr-3">
				<div class="ais-Panel ais-Dropdown">
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
			<div id="level" class="inline-block mr-2 md:mr-3">
				<div class="ais-Panel ais-Dropdown">
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
			<div id="country" class="inline-block mr-2 md:mr-3">
				<div class="ais-Panel ais-Dropdown">
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
			<div id="category" class="inline-block mr-2 md:mr-3">
				<div class="ais-Panel ais-Dropdown">
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
			<div id="amount" class="inline-block mr-2 md:mr-3">
				<div class="ais-Panel ais-Dropdown">
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
			<div id="course" class="inline-block mr-2 md:mr-3">
				<div class="ais-Panel ais-Dropdown">
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
			<div id="interview" class="inline-block mr-2 md:mr-3">
				<div class="ais-Panel ais-Dropdown">
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
			<div id="reset" class="inline-block mr-2 mb-6 md:mr-3"></div>
		</div>
	</div>
</div>
<div class="results w-11/12 mx-auto my-8 md:w-full">
	<div id="stats" class="ml-2 md:ml-12 lg:ml-60"></div>
	<div id="hits" class="flex flex-col items-center justify-center"></div>
	<div id="pagination"></div>
</div>
