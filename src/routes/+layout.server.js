import { getUser } from '$lib/firebase/database.server';

// @ts-ignore
export function load({ locals }) {
	if (locals.user) {
		const user = getUser(locals.user.id) || null;

		return {
			isLoggedIn: locals.user !== null,
			user
		};
	}
}
