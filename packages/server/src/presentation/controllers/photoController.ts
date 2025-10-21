import {UploadProfilePictureUseCase} from "$application/use-cases/pictures/uploadProfilePictureUseCase";
import {APIResponse} from "$utils/responseUtils.utils";
import {Request, Response} from "express";

/**
 * PhotoController - Couche Présentation
 * Gère les requêtes HTTP relatives aux photos dans Pawbook
 */

export class PhotoController {
    constructor(
        private readonly uploadProfilePictureUseCase: UploadProfilePictureUseCase
    ) {}

    /**
     * Upload une photo de profil en supprimant la précédente si existante
     */
    async uploadProfilePicture(req: Request, res: Response) {
        try {
            if (!req.file) return APIResponse(res, null, "Aucun fichier fourni", 400);

            if (!req.user?.id) return APIResponse(res, null, "Non authentifié", 401);

            const updatedUser = await this.uploadProfilePictureUseCase.execute(
                req.user.id,
                req.file
            );

            return APIResponse(res, {profilePicture: updatedUser.profilePicture}, "Photo de profil mise à jour", 200);

        } catch (error) {
            console.error("Erreur upload photo:", error);

            const message = error instanceof Error
                ? error.message
                : "Erreur lors de l'upload de la photo de profil";

            const statusCode = error instanceof Error &&
            (error.message.includes("introuvable") ||
                error.message.includes("fichier") ||
                error.message.includes("taille"))
                ? 400
                : 500;

            return APIResponse(res, null, message, statusCode);
        }
    }
}