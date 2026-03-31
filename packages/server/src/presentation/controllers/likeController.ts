import {GetAllPostLikesByAuthorUseCase} from "$application/use-cases/like/GetAllPostLikesByAuthorUseCase";
import {UnlikeAPostUseCase} from "$application/use-cases/like/UnlikeAPostUseCase";
import {LikeAPostUseCase} from "$application/use-cases/like/LikeAPostUseCase";
import {getHttpStatus} from "$presentation/errors/httpErrorMapper";
import {APIResponse} from "$utils/responseUtils.utils";
import {Request, Response} from "express";

/**
 * LikeController - Couche Présentation
 * Gère les requêtes HTTP relatives aux likes de Pawbook
 */
export class LikeController {
    constructor(
        private readonly likeAPostUseCase: LikeAPostUseCase,
        private readonly unlikeAPostUseCase: UnlikeAPostUseCase,
        private readonly getAllPostLikesByAuthorUseCase: GetAllPostLikesByAuthorUseCase
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

    async unlikePost(req: Request, res: Response) {
        try {
            const { postId } = req.params;

            if (!postId) {
                return APIResponse(res, null, "Invalid postId parameter", 400);
            }

            const unlikeData = {
                authorId: req.user.id,
                postId: req.params.postId as string,
            }

            const unlike = await this.unlikeAPostUseCase.execute(unlikeData);

            return APIResponse(res, null, "Like supprimé avec succès", 200);
        } catch (error) {
            const status = getHttpStatus(error);
            const message = error instanceof Error ? error.message : "Unlike error";

            return APIResponse(res, null, message, status);
        }
    }

    async getAllPostLikesByAuthorId(req: Request, res: Response) {
        try {
            const authorId = req.user.id;

            if (!authorId) {
                return APIResponse(res, null, "Invalid authorId parameter", 400);
            }

            const postLikes = await this.getAllPostLikesByAuthorUseCase.execute(authorId);

            return APIResponse(res, postLikes, "Likes récupérés avec succès", 200);
        } catch (error) {
            const status = getHttpStatus(error);
            const message = error instanceof Error ? error.message : "Like error";

            return APIResponse(res, null, message, status);
        }
    }
}