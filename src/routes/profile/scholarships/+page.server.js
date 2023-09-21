import { getSavedScholarships } from '$lib/firebase/database.server';
import { redirect } from '@sveltejs/kit';

// @ts-ignore
export async function load({ locals }) {
	if (locals.user) {
		const scholarships = await getSavedScholarships(locals.user.id);

		return {
			scholarships
		};
	} else {
		throw redirect(303, '/login');
	}
}
