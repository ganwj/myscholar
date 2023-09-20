// @ts-nocheck
import yup from 'yup';

export default async function validateProfile(formData) {
	const schema = yup.object({
		name: yup.string().required(),
		email: yup.string().email().required()
	});

	const data = {
		name: formData.get('name'),
		email: formData.get('email')
	};

	try {
		await schema.validate(data, { abortEarly: false });

		const profileData = {
			...data,
			program: formData.get('program'),
			level: formData.get('level'),
			country: formData.get('country'),
			hasProfile: true
		};

		return { success: true, profile: profileData };
	} catch (error) {
		const errors = error.inner.reduce((agg, e) => {
			if (!agg['error_' + e.path]) {
				agg['error_' + e.path] = e.message;
			}
			return agg;
		}, {});

		return { ...errors, ...data, success: false };
	}
}
