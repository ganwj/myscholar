import { getPersonalizedScholarships } from '$lib/firebase/database.server';
import { redirect } from '@sveltejs/kit';

// @ts-ignore
export async function load({ url, locals }) {
	const page = url.searchParams.get('page') || 1;

	if (locals.user) {
		const { scholarships, totalPages, totalScholarships } = await getPersonalizedScholarships(
			locals.user.id,
			+page
		);

		return {
			scholarships,
			page,
			totalPages,
			totalScholarships
		};
	} else {
		throw redirect(303, '/login');
	}
}
