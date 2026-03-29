import {LikeAPostUseCase} from "$application/use-cases/like/LikeAPostUseCase";
import {APIResponse} from "$utils/responseUtils.utils";
import {Request, Response} from "express";
import {getHttpStatus} from "$presentation/errors/httpErrorMapper";

/**
 * LikeController - Couche Présentation
 * Gère les requêtes HTTP relatives aux likes de Pawbook
 */
export class LikeController {
    constructor(
        private readonly likeAPostUseCase: LikeAPostUseCase,
    ) {}

    /**
     * Crée un nouveau like de post
     */
    async likePost(req: Request, res: Response) {
        try {
            const postLike = await this.likeAPostUseCase.execute({
                authorId: req.user.id,
                postId: req.params.postId as string,
            });

            return APIResponse(res, postLike.getPublicData(), "Nouveau like créé avec succès", 201);
        } catch (error) {
            const status = getHttpStatus(error);
            const message = error instanceof Error ? error.message : "Like error";

            return APIResponse(res, null, message, status);
        }
    }
}