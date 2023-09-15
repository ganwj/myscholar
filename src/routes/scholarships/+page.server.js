import { PUBLIC_PAGE_SIZE, PUBLIC_SEARCH_API_KEY } from '$env/static/public';
import { showAllScholarships } from '$lib/firebase/database.server';
import { db } from '$lib/firebase/firebase.server';
import algoliasearch from 'algoliasearch/lite';

// @ts-ignore
export async function load({ url }) {
	const page = url.searchParams.get('page') || 1;
	const query = url.searchParams.get('q');

	if (query === '' || query === null) {
		const { scholarships, totalPages } = await showAllScholarships(+page);

		return {
			scholarships,
			page,
			totalPages
		};
	} else {
		const client = algoliasearch('NB9FC86OPB', PUBLIC_SEARCH_API_KEY);
		const index = client.initIndex('scholarships');
		const result = await index.search(query);
		const hits = result.hits;
		// console.log('Results: ' + JSON.stringify(hits, null, 2));
		const totalScholarships = hits.length;
		const totalPages = Math.ceil(totalScholarships / +PUBLIC_PAGE_SIZE);
		const scholarships = [];
		if (totalScholarships > 0) {
			for (let i = (+page - 1) * +PUBLIC_PAGE_SIZE; i < +page * +PUBLIC_PAGE_SIZE; i++) {
				if (i >= totalScholarships) {
					break;
				}

				const ref = db.collection('scholarships').doc(hits[i].objectID);
				const doc = await ref.get();
				const item = {
					id: doc.id,
					...doc.data()
				};
				scholarships.push(item);
			}
		}

		return {
			scholarships,
			page,
			totalPages
		};
	}
}