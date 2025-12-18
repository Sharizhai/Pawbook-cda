import {IPhotoStorageService} from "$domain/interfaces/photoStorageServices.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import multer from "multer";

export class UploadProfilePictureUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly photoStorageServices : IPhotoStorageService,
    ) {}

    async execute(userId: string, file: Express.Multer.File) {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        this.validateFile(file);

        if (user.profilePicture) {
            try {
                const publicId = this.extractPublicId(user.profilePicture);
                await this.photoStorageServices.delete(publicId);
            } catch (error) {
                console.warn("Échec de la suppression de l'ancienne photo:", error);
            }
        }

        const newPhotoUrl = await this.photoStorageServices.uploadProfilePicture(userId, file);
        const updatedUser = user.updateWith({ profilePicture: newPhotoUrl });

        return await this.userRepository.save(updatedUser);
    }

    private validateFile(file: Express.Multer.File): void {
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error("Le fichier doit être une image (JPEG, PNG ou WebP)");
        }

        const maxSize = 15 * 1024 * 1024;

        if (file.size > maxSize) {
            throw new Error("La taille de l'image ne doit pas dépasser 15MB");
        }
    }

    private extractPublicId(cloudinaryUrl: string): string {
        if (cloudinaryUrl.includes('localhost/mock')) {
            const match = cloudinaryUrl.match(/\/mock\/(.+)$/);
            if (match) {
                return match[1].replace(/\.[^/.]+$/, ''); // Enlever l'extension
            }
        } else {
            const parts = cloudinaryUrl.split('/upload/');
            if (parts.length < 2) {
                throw new Error("URL Cloudinary invalide");
            }

            const pathWithVersion = parts[1];
            const pathParts = pathWithVersion.split('/');
            pathParts.shift();

            const fullPath = pathParts.join('/');
            return fullPath.replace(/\.[^/.]+$/, ''); // Enlever l'extension
        }

        throw new Error("Format d'URL non reconnu");
    }
}