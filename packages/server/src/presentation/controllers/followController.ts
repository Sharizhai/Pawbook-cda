import {UnfollowAUserUseCase} from "$application/use-cases/follow/UnfollowAUserUseCase";
import {FollowAUserUseCase} from "$application/use-cases/follow/FollowAUserUseCase";
import {APIResponse} from "$utils/responseUtils.utils";
import {Request, Response} from "express";

/**
 * FollowController - Couche Présentation
 * Gère les requêtes HTTP relatives aux follows de Pawbook
 */

export class FollowController {
    constructor(
        private readonly followAUserUseCase: FollowAUserUseCase,
        private readonly unfollowAUserUseCase: UnfollowAUserUseCase
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

            return APIResponse(res, payload, "Nouveau follow créé avec succès", 201);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur lors de la création du follow";

            return APIResponse(res, null, message, 500);
        }
    }

    async deleteFollow(req: Request, res: Response) {
        try {
            const unfollowData = {
                followerId: req.user.id,
                followingId: req.params.followingId,
            }

            const unfollow = await this.unfollowAUserUseCase.execute(unfollowData);

            return APIResponse(res, unfollow, "Follow supprimé avec succès", 200);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur lors de la suppression du follow";

            return APIResponse(res, null, message, 500);
        }
    }
}