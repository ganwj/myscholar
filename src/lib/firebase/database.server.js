import { PUBLIC_PAGE_SIZE } from '$env/static/public';
import { db } from '$lib/firebase/firebase.server';
import { error } from '@sveltejs/kit';
import admin from 'firebase-admin';

// @ts-ignore
export async function saveScholarship(scholarship) {
	const collection = db.collection('scholarships');
	collection.add(scholarship);
}

export async function update() {
	const snapshot = await db
		// UK
		// .collection('scholarships')
		// .where('institution', 'in', [
		// 	'University of Portsmouth',
		// 	'Istituto Marangoni',
		// 	'University of Huddersfield',
		// 	'Middlesex University',
		// 	'De Montfort University (DMU)',
		// 	'CATS Boarding Schools, UK',
		// 	'KAPLAN',
		// 	'University of the West of England (UWE, Bristol)',
		// 	'Teesside University',
		// 	'University of Derby'
		// ])
		// .collection('scholarships')
		// .where('institution', 'in', ['ONCAMPUS'])
		// CN
		// .collection('scholarships')
		// .where('institution', 'in', ['Shanghai University of TCM (SHUTCM)'])
		// IRELAND
		// .collection('scholarships')
		// .where('institution', 'in', ['University of Galway'])
		// AUSTRALIA
		// .collection('scholarships')
		// .where('institution', 'in', ['University of Tasmania (UTAS)'])
		// .collection('scholarships')
		// .where('application', 'array-contains', '')
		// .collection('scholarships')
		// .where('field_of_study', '==', 'Any field')
		.collection('scholarships')
		.where('course_level', '==', 'All levels')
		.get();

	snapshot.docs.forEach(async (doc) => {
		const docRef = db.collection('scholarships').doc(doc.id);
		await docRef.update({
			// application: admin.firestore.FieldValue.arrayRemove('')
			course_level: 'All Levels'
			// field_of_study: 'All Fields'
		});
	});
}

export async function showAllScholarships(page = 1) {
	const scholarshipCount = await db.collection('scholarships').count().get();

	const totalScholarships = await scholarshipCount.data().count;

	const totalPages = Math.ceil(totalScholarships / +PUBLIC_PAGE_SIZE);

	const scholarshipsSnapshot = await db
		.collection('scholarships')
		.limit(+PUBLIC_PAGE_SIZE)
		.offset((page - 1) * +PUBLIC_PAGE_SIZE)
		.orderBy('name', 'asc')
		.get();

	const scholarships = scholarshipsSnapshot.docs.map((doc) => {
		return {
			id: doc.id,
			...doc.data()
		};
	});

	return {
		scholarships,
		totalPages,
		totalScholarships
	};
}

/**
 * @param {string} scholarshipId
 * @return {Promise<any>}
 */
export async function getScholarship(scholarshipId, userId = null) {
	const ref = await db.collection('scholarships').doc(scholarshipId).get();

	if (ref.exists) {
		const user = userId !== null ? await getUser(userId) : null;
		const savedScholarship = user?.scholarshipIds?.includes(scholarshipId) || false;

		return { id: ref.id, ...ref.data(), savedScholarship };
	}
}

/**
 * @param {string} scholarshipId
 * @param {string} userId
 */
export async function toggleSaveScholarship(scholarshipId, userId) {
	const userDoc = db.collection('users').doc(userId);

	const user = await userDoc.get();
	const userData = user.data();

	if (userData) {
		// unsave the scholarship
		if (userData.scholarshipIds && userData.scholarshipIds.includes(scholarshipId)) {
			await userDoc.update({
				scholarshipIds: admin.firestore.FieldValue.arrayRemove(scholarshipId)
			});
		}
		// save the scholarship
		else {
			await userDoc.update({
				scholarshipIds: admin.firestore.FieldValue.arrayUnion(scholarshipId)
			});
		}

		// @ts-ignore
		return await getScholarship(scholarshipId, userId);
	} else {
		throw error(404, 'User not found!');
	}
}

/**
 * @param {any} profile
 * @param {string} userId
 */
export async function createProfile(profile, userId) {
	const collection = await db.collection('users');

	const ref = await collection.doc(userId);
	await ref.set(
		{
			...profile
		},
		{ merge: true }
	);
}

/**
 * @param {string} userId
 */
export async function getUser(userId) {
	const user = await db.collection('users').doc(userId).get();
	return user?.data();
}

/**
 * @param {string} userId
 */
export async function getPersonalizedScholarships(userId, page = 1) {
	const user = await getUser(userId);
	// @ts-ignore
	const country = user.country;
	// @ts-ignore
	const level = user.level;
	// @ts-ignore
	const program = user.program;

	let scholarshipCount;
	let snapshot;

	if (country === 'Malaysia') {
		snapshot = await db
			.collection('scholarships')
			.where('country', '==', 'Malaysia')
			.where('course_level', 'in', [level, 'All Levels'])
			.where('field_of_study', 'in', [program, 'All Fields'])
			.limit(+PUBLIC_PAGE_SIZE)
			.offset((page - 1) * +PUBLIC_PAGE_SIZE)
			.orderBy('name', 'asc')
			.get();

		scholarshipCount = await db
			.collection('scholarships')
			.where('country', '==', 'Malaysia')
			.where('course_level', 'in', [level, 'All Levels'])
			.where('field_of_study', 'in', [program, 'All Fields'])
			.count()
			.get();
	} else {
		snapshot = await db
			.collection('scholarships')
			.where('country', '!=', 'Malaysia')
			.where('course_level', 'in', [level, 'All Levels'])
			.where('field_of_study', 'in', [program, 'All Fields'])
			.limit(+PUBLIC_PAGE_SIZE)
			.offset((page - 1) * +PUBLIC_PAGE_SIZE)
			.orderBy('name', 'asc')
			.get();

		scholarshipCount = await db
			.collection('scholarships')
			.where('country', '!=', 'Malaysia')
			.where('course_level', 'in', [level, 'All Levels'])
			.where('field_of_study', 'in', [program, 'All Fields'])
			.count()
			.get();
	}

	const totalScholarships = await scholarshipCount.data().count;
	const totalPages = Math.ceil(totalScholarships / +PUBLIC_PAGE_SIZE);

	const scholarships = snapshot.docs.map((doc) => {
		const savedScholarship = user?.scholarshipIds?.includes(doc.id) || false;

		return {
			id: doc.id,
			...doc.data(),
			savedScholarship
		};
	});

	return {
		scholarships,
		totalPages,
		totalScholarships
	};
}

/**
 * @param {string} userId
 * @returns {Promise<any>}
 */
export async function getSavedScholarships(userId) {
	const user = await getUser(userId);

	const scholarshipIds = user?.scholarshipIds || [];

	if (scholarshipIds.length === 0) {
		return [];
	}

	const scholarships = await db
		.collection('scholarships')
		.where(admin.firestore.FieldPath.documentId(), 'in', scholarshipIds)
		.get();

	return scholarships.docs.map((d) => {
		return { id: d.id, ...d.data(), savedScholarship: true };
	});
}
