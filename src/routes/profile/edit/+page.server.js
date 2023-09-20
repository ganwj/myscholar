import { createProfile } from '$lib/firebase/database.server';
import validateProfile from '$lib/validators/profile.validator';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	// @ts-ignore
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = await validateProfile(formData);
		if (!data.success) {
			return fail(422, data);
		}
		createProfile(data.profile, locals.user.id);
		throw redirect(303, '/profile');
	}
};
