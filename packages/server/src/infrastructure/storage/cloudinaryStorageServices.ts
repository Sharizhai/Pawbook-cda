import {IPhotoStorageService} from "$domain/interfaces/photoStorageServices.interface";
import cloudinary from "$config/cloudinary";
import multer from "multer";

export class CloudinaryStorageServices implements IPhotoStorageService {
    constructor() {}

    async uploadProfilePicture(userId: string, file: Express.Multer.File): Promise<string> {
        const fileInfo = await cloudinary.uploader.upload(file.path, {
            folder: `pawbook/users/${userId}/profile`,
            overwrite: true,
            tags: ["pawbook", "profilePicture", `user_${userId}`],
            resource_type: "image"
        });

        await this.cleanupTempFile(file.path);

        return fileInfo.secure_url;
    }

    async uploadPostPicture(userId: string, postId: string, file: Express.Multer.File): Promise<string> {
        const fileInfo = await cloudinary.uploader.upload(file.path, {
            folder: `pawbook/users/${userId}/posts/${postId}`,
            tags: ["pawbook", "post", `user_${userId}`, `post_${postId}`]
        })

        await this.cleanupTempFile(file.path);

        return fileInfo.secure_url;
    }

    async uploadMultiple(userId: string, postId: string, files: Express.Multer.File[]): Promise<string[]> {
        const uploadPromises = files.map(file =>
            cloudinary.uploader.upload(file.path, {
                folder: `pawbook/users/${userId}/posts/${postId}`,
                tags: ["pawbook", "post", `user_${userId}`, `post_${postId}`],
                resource_type: "image"
            })
        );

        const results = await Promise.all(uploadPromises);

        await Promise.all(files.map(file => this.cleanupTempFile(file.path)));

        return results.map(result => result.secure_url);
    }

    delete(photoId: string): Promise<void> {
        return cloudinary.uploader.destroy(photoId);
    }

    async deletePostPhotos(userId: string, postId: string): Promise<void> {
        await cloudinary.api.delete_resources_by_prefix(
            `pawbook/users/${userId}/posts/${postId}`
        );

        await cloudinary.api.delete_folder(
            `pawbook/users/${userId}/posts/${postId}`
        );
    }

    private async cleanupTempFile(filePath: string): Promise<void> {
        try {
            const fs = await import('fs/promises');
            await fs.unlink(filePath);
        } catch (error) {
            console.warn('Échec de suppression du fichier temporaire:', error);
        }
    }
}