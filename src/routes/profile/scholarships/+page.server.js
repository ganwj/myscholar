import { getSavedScholarships } from '$lib/firebase/database.server';

// @ts-ignore
export async function load({ locals }) {
	const scholarships = await getSavedScholarships(locals?.user?.id);

	return {
		scholarships
	};
}
