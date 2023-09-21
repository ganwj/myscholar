import { getScholarship } from '$lib/firebase/database.server';
import { error } from '@sveltejs/kit';

// @ts-ignore
export async function load({ params, locals }) {
	const scholarship = await getScholarship(params.id, locals?.user?.id);

	if (!scholarship) {
		throw error(404, { message: 'Scholarship not found!' });
	}

	return {
		scholarship
	};
}
