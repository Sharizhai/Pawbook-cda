import {GetAllPostsUseCase} from "$application/use-cases/post/GetAllPostsUseCase";
import {APIResponse} from "$utils/responseUtils.utils";

/**
 * PostController - Couche Présentation
 * Gère les requêtes HTTP relatives aux posts de Pawbook
 */

export class PostController {
    constructor(private readonly getAllPostsUseCase: GetAllPostsUseCase) {}

    /**
     * Récupère tous les posts de la communauté
     */
    async getAllPosts(req: any, res: any) {
        try {
            const skip = parseInt(req.query.skip as string) || 0;
            const limit = Math.min(parseInt(req.query.limit as string) || 10, 50); // Max 50

            const posts = await this.getAllPostsUseCase.execute(skip, limit);

            return APIResponse(res, posts, "Posts récupérés avec succès");

        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur lors de la récupération des posts";

            return APIResponse(res, null, message, 500);
        }
    }
}