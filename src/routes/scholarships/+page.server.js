import { showAllScholarships } from '$lib/firebase/database.server';

// @ts-ignore
export async function load({ url }) {
	const page = url.searchParams.get('page') || 1;
	const { scholarships, totalPages } = await showAllScholarships(+page);

	return {
		scholarships,
		page,
		totalPages
	};
}
