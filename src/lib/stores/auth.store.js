import { browser } from '$app/environment';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { readable } from 'svelte/store';

export default readable({ isActive: false, isLoggedin: false, userId: '' }, (set) => {
	if (browser) {
		onAuthStateChanged(getAuth(), (user) => {
			if (user) {
				set({ isActive: true, isLoggedin: true, userId: user.uid });
			} else {
				set({ isActive: true, isLoggedin: false, userId: '' });
			}
		});
	}
});
