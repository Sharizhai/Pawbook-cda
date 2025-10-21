import {IPhotoStorageService} from "$domain/interfaces/photoStorageServices.interface";

export class InMemoryPhotosStorageServices implements IPhotoStorageService {
    private storage: Map<string, string> = new Map();

    async uploadProfilePicture(userId: string, file: Express.Multer.File): Promise<string> {
        const url = `http://localhost/mock/users/${userId}/profile/${file.originalname}`;
        this.storage.set(`profile_${userId}`, url);
        return url;
    }

    async uploadPostPicture(userId: string, postId: string, file: Express.Multer.File): Promise<string> {
        const url = `http://localhost/mock/users/${userId}/posts/${postId}/${file.originalname}`;
        this.storage.set(`post_${postId}`, url);
        return url;
    }

    async uploadMultiple(userId: string, postId: string, files: Express.Multer.File[]): Promise<string[]> {
        return files.map((file, index) =>
            `http://localhost/mock/users/${userId}/posts/${postId}/image_${index + 1}.jpg`
        );
    }

    async delete(publicId: string): Promise<void> {
        this.storage.delete(publicId);
        console.log(`[InMemory] Deleted: ${publicId}`);
    }

    async deletePostPhotos(userId: string, postId: string): Promise<void> {
        const prefix = `users/${userId}/posts/${postId}`;
        for (const key of this.storage.keys()) {
            if (key.startsWith(prefix)) {
                this.storage.delete(key);
            }
        }
    }

    has(publicId: string): boolean {
        return this.storage.has(publicId);
    }
}