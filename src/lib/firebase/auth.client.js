import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendPasswordResetEmail
} from 'firebase/auth';

export async function loginWithGoogle() {
	const auth = getAuth();
	const provider = new GoogleAuthProvider();
	const userCredential = await signInWithPopup(auth, provider);
	return userCredential.user;
}

export async function logout() {
	await signOut(getAuth());
	await fetch('/logout');
}

/**
 * @param {string} email
 * @param {string} password
 */
export async function registerWithEmailandPassword(email, password) {
	const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
	return userCredential.user;
}

/**
 * @param {string} email
 * @param {string} password
 */
export async function loginWithEmailAndPassword(email, password) {
	const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
	return userCredential.user;
}

/**
 * @param {string} email
 */
export async function mailResetPassword(email) {
	await sendPasswordResetEmail(getAuth(), email);
}

export async function sendJWTToken() {
	const auth = getAuth();
	const user = auth.currentUser;

	if (!user) {
		return;
	}

	const token = await user.getIdToken(true);
	await fetch('/token', {
		method: 'POST',
		body: JSON.stringify({ token, email: user.email })
	});
}
