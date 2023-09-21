// import { getScholarship, toggleSaveScholarship } from '$lib/firebase/database.server';
// import { error, json } from '@sveltejs/kit';

// // @ts-ignore
// export async function GET({ params, locals }) {
// 	if (!locals.user) {
// 		throw error(403, { message: 'Access Denied. Please create an account first.' });
// 	}

// 	const scholarship = await getScholarship(params.id);
// 	if (!scholarship) {
// 		throw error(404, { message: 'Scholarship not found!' });
// 	}

// 	try {
// 		const newScholarship = await toggleSaveScholarship(params.id, locals.user.id);
// 		return json({ ...newScholarship });
// 	} catch (e) {
// 		console.log(e);
// 		throw error(500, { message: 'Server Error' });
// 	}
// }
