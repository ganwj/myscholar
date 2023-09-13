import { getScholarship } from '$lib/firebase/database.server';
import { error } from '@sveltejs/kit';

// @ts-ignore
export async function load({ params }) {
    const scholarship = await getScholarship(params.id);

    if (!scholarship) {
        throw error(404, { message: 'Scholarship not found!' });
    }

    return {
        scholarship
    }
}