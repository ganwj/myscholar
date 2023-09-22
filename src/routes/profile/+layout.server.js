import { getUser } from '$lib/firebase/database.server';

// @ts-ignore
export async function load({ locals }) {
	let user;

	if (locals.user) {
		user = await getUser(locals.user.id);
	}

	return {
		user
	};
}
