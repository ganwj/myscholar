import { PAGE_SIZE } from '$env/static/private';
import { db } from '$lib/firebase/firebase.server';
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
		.collection('scholarships')
		.where('application', 'array-contains', '')
		.get();

	snapshot.docs.forEach(async (doc) => {
		const docRef = db.collection('scholarships').doc(doc.id);
		await docRef.update({
			application: admin.firestore.FieldValue.arrayRemove('')
		});
	});
}

export async function showAllScholarships(page = 1) {
	const scholarshipCount = await db.collection('scholarships').count().get();

	const totalScholarships = await scholarshipCount.data().count;

	const totalPages = Math.ceil(totalScholarships / +PAGE_SIZE);

	const scholarshipsSnapshot = await db
		.collection('scholarships')
		.limit(+PAGE_SIZE)
		.offset((page - 1) * +PAGE_SIZE)
		.orderBy('institution', 'asc')
		.get();

	const scholarships = scholarshipsSnapshot.docs.map((doc) => {
		return {
			id: doc.id,
			...doc.data()
		};
	});

	return {
		scholarships,
		totalPages
	};
}

/**
 * @param {string} id
 * @return {Promise<any>}
 */
export async function getScholarship(id) {
	const ref = await db.collection('scholarships').doc(id).get();

	if (ref.exists) {
		return { id: ref.id, ...ref.data() };
	}
}
