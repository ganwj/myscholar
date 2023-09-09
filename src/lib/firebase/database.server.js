import { db } from '$lib/firebase/firebase.server';

// @ts-ignore
export async function saveScholarship(scholarship) {
	const collection = db.collection('scholarships');
	collection.add(scholarship);
}
