import {FollowAUserUseCase} from "$application/use-cases/follow/FollowAUserUseCase";
import {Request, Response} from "express";
import {APIResponse} from "$utils/responseUtils.utils";

/**
 * FollowController - Couche Présentation
 * Gère les requêtes HTTP relatives aux follows de Pawbook
 */

export class FollowController {
    constructor(
        private readonly followAUserUseCase: FollowAUserUseCase
    ) {}

    /**
     * Crée une nouvelle relation de follow entre deux utilisateurs
     */

    async createFollow(req: Request, res: Response) {
        try {
            const follow = await this.followAUserUseCase.execute(req.body);

            const payload = {
                id: follow.id,
                followerId: follow.followerId,
                followingId: follow.followingId,
                createdAt: follow.createdAt,
            }

            return APIResponse(res, payload, "Nouveau follow créé avec succès, 201")
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur lors de la création du follow";

            return APIResponse(res, null, message, 500);
        }
    }
}