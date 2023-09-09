import { PUBLIC_STORAGE_BUCKET } from '$env/static/public';
import { storage } from '$lib/firebase/firebase.server';

/**
 * @param {string} destination
 * @param {string} path
 */
export async function saveFileToBucket(path, destination) {
	const filePath = path;
	const uploadResult = await storage
		.bucket(PUBLIC_STORAGE_BUCKET)
		.upload(filePath, { destination, public: true });

	return uploadResult[0].publicUrl();
}
