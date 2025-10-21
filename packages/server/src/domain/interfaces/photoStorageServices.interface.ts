import multer from "multer";

/**
 * Interface IPhotoStorageService - Couche Domaine
 * Définit le contrat pour la gestion des photos
 */
export interface IPhotoStorageService {

    /**
     * Upload une image sur Cloudinary
     * @param userId
     * @param file
     * @returns URL de l'image si l'upload réussi
     * @throws Error si l'userId ou le file est invalide
     */
    uploadProfilePicture(userId: string, file: Express.Multer.File): Promise<string>;

    /**
     * Upload une image sur Cloudinary
     * @param userId
     * @param postId
     * @param file
     * @returns URL de l'image si l'upload réussi
     * @throws Error si l'userId ou le file est invalide
     */
    uploadPostPicture(userId: string, postId: string, file: Express.Multer.File): Promise<string>;

    /**
     * Upload plusieurs images sur Cloudinary
     * @param userId
     * @param postId
     * @param files
     * @returns les URL des images si l'upload réussi
     * @throws Error si l'userId ou les files est invalide
     */
    uploadMultiple(userId: string, postId: string, files: Express.Multer.File[]): Promise<string[]>;

    /**
     * Supprime une image sur Cloudinary
     * @param photoId
     * @returns void
     * @throws Error si l'id de la photo est invalide ou si la suppression échoue
     */
    delete(photoId: string): Promise<void>;

    /**
     * Supprime toutes les images d'un post sur Cloudinary'
     * @param userId
     * @param postId
     * @returns void
     * @throws Error si l'id du user ou du post est invalide ou si la suppression échoue
     */
    deletePostPhotos(userId: string, postId: string): Promise<void>
}