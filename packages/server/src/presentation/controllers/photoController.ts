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
            if (!req.file) {
                return APIResponse(res, null, "Aucun fichier fourni", 400);
            }

            const targetUserId = req.params.id;

            if (!targetUserId) {
                return APIResponse(res, null, "Identifiant utilisateur manquant", 400);
            }

            if (Array.isArray(targetUserId)) {
                return APIResponse(res, null, "Invalid user ID parameter", 400);
            }

            const currentUserId = req.user?.id;

            if (currentUserId !== targetUserId && req.user?.role !== "ADMIN") {
                return APIResponse(res, null, "Non autorisé à modifier cette photo", 403);
            }

            const updatedUser = await this.uploadProfilePictureUseCase.execute(
                targetUserId,
                req.file
            );

            return APIResponse(
                res,
                { profilePicture: updatedUser.profilePicture },
                "Photo de profil mise à jour",
                200
            );

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