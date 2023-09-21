import { createProfile } from '$lib/firebase/database.server';
import messagesStore from '$lib/stores/messages.store';
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

		if (locals.user) {
			createProfile(data.profile, locals.user.id);
			throw redirect(303, '/profile/pa');
		} else {
			messagesStore.showError('Something is wrong. Please sign out and try again.');
		}
	}
};
