import {GetAllPostsByAuthorIdUseCase} from "$application/use-cases/post/GetAllPostsByAuthorIdUseCase";
import {GetAllPostsUseCase} from "$application/use-cases/post/GetAllPostsUseCase";
import {APIResponse} from "$utils/responseUtils.utils";
import {Request, Response} from "express";
import {CreatePostUseCase} from "$application/use-cases/post/CreatePostUseCase";

/**
 * PostController - Couche Présentation
 * Gère les requêtes HTTP relatives aux posts de Pawbook
 */

export class PostController {
    constructor(
        private readonly createPostUseCase: CreatePostUseCase,
        private readonly getAllPostsUseCase: GetAllPostsUseCase,
        private readonly getAllPostsByAuthorIdUseCase: GetAllPostsByAuthorIdUseCase
    ) {}

    /**
     * Récupère tous les posts de la communauté
     */
    async getAllPosts(req: Request, res: Response) {
        try {
            const page = Math.max(parseInt(req.query.page as string) || 1, 1);
            const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

            const result = await this.getAllPostsUseCase.execute(page, limit);

            const mapped = {
                hasMore: result.hasMore,
                posts: result.posts.map((p: any) => ({
                    id: p.id,
                    authorId: p?.author
                        ? {
                            id: p.author.id,
                            name: p.author.name,
                            firstName: p.author.firstName,
                            profilePicture: p.author.profilePicture ?? null,
                          }
                        : p.authorId,
                    textContent: p.textContent ?? null,
                    photoContent: p.photoContent ?? [],
                    likes: p.likes ?? [],
                    likeCount: p.likeCount ?? 0,
                    comments: p.comments ?? [],
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                }))
            };

            return APIResponse(res, mapped, "Posts récupérés avec succès");

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
    async getPostById(req: Request, res: Response) {
        try {
            const id = req.params.id;

            if (!id) {
                return APIResponse(res, null, "ID de l'utilisateur requis", 400);
            }

            if (Array.isArray(id)) {
                return APIResponse(res, null, "Invalid user ID parameter", 400);
            }

            const page = Math.max(parseInt(req.query.page as string) || 1, 1);
            const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

            const result = await this.getAllPostsByAuthorIdUseCase.execute(page, limit, id);

            const mapped = {
                hasMore: result.hasMore,
                authorId: id,
                posts: result.posts.map((p: any) => ({
                    id: p.id,
                    authorId: p?.author
                        ? {
                            id: p.author.id,
                            name: p.author.name,
                            firstName: p.author.firstName,
                            profilePicture: p.author.profilePicture ?? null,
                        }
                        : p.authorId,
                    textContent: p.textContent ?? null,
                    photoContent: p.photoContent ?? [],
                    likes: p.likes ?? [],
                    likeCount: p.likeCount ?? 0,
                    comments: p.comments ?? [],
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                }))
            };

            return APIResponse(res, mapped, "Posts récupérés avec succès")
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur lors de la récupération des posts";

            const statusCode = message === "User not found" ? 404 : 500;

            return APIResponse(res, null, message, statusCode);
        }
    }

    /**
     * Crée un nouveau post
     */
    async createPost(req: Request, res: Response) {
        try {
            const post: any = await this.createPostUseCase.execute(req.body);

            const payload = {
                id: post.id,
                authorId: post?.author
                    ? {
                        id: post.author.id,
                        name: post.author.name,
                        firstName: post.author.firstName,
                        profilePicture: post.author.profilePicture ?? null,
                      }
                    : post.authorId,
                textContent: post.textContent ?? null,
                photoContent: post.photoContent ?? [],
                likes: post.likes ?? [],
                comments: post.comments ?? [],
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            };

            return APIResponse(res, payload, "Nouveau post créé avec succès, 201")
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur lors de la création du post";

            return APIResponse(res, null, message, 500);
        }
    }
}