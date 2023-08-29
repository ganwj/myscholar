import { setDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase.client';

/**
 * @param {string} userId
 */
export async function setUser(userId) {
	const users = collection(db, 'users');
	const docRef = doc(db, 'users', userId);
	const docSnap = await getDoc(docRef);
	if (!docSnap.exists()) {
		await setDoc(doc(users, userId), {
			user_id: userId
		});
	}
}
