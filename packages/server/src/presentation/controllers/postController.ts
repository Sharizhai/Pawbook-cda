import {GetAllPostsByAuthorIdUseCase} from "$application/use-cases/post/GetAllPostsByAuthorIdUseCase";
import {GetAllPostsUseCase} from "$application/use-cases/post/GetAllPostsUseCase";
import {APIResponse} from "$utils/responseUtils.utils";

/**
 * PostController - Couche Présentation
 * Gère les requêtes HTTP relatives aux posts de Pawbook
 */

export class PostController {
    constructor(
        private readonly getAllPostsUseCase: GetAllPostsUseCase,
        private readonly getAllPostsByAuthorIdUseCase: GetAllPostsByAuthorIdUseCase
    ) {}

    /**
     * Récupère tous les posts de la communauté
     */
    async getAllPosts(req: any, res: any) {
        try {
            const page = Math.max(parseInt(req.query.page as string) || 0, 0);
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

    /**
     * Récupère tous les posts d'un user à l'aide de son ID'
     */
    async getPostById(req: any, res: any) {
        try {
            const id = req.params.id;
            const page = Math.max(parseInt(req.query.page as string) || 0, 0);
            const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

            if(!id) return APIResponse(res, null, "ID de l'utilisateur requis", 400);

            const result = await this.getAllPostsByAuthorIdUseCase.execute(page, limit, id);

            return APIResponse(res, result, "Posts récupérés avec succès")
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur lors de la récupération des posts";

            const statusCode = message === "User not found" ? 404 : 500;

            return APIResponse(res, null, message, statusCode);
        }
    }
}