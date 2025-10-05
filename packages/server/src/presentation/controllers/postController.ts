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
            const page = Math.max(parseInt(req.query.page as string) || 1, 1);
            const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

            const result = await this.getAllPostsUseCase.execute(page, limit);

            return APIResponse(res, result, "Posts récupérés avec succès");

        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur lors de la récupération des posts";

            return APIResponse(res, null, message, 500);
        }
    }
}