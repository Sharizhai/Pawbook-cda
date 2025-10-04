import {PostController} from "$presentation/controllers/postController";
import express from "express";

/**
 * Routes pour la gestion des posts du coworking
 * @param postController - Contrôleur des posts
 * @param middleware - Middleware
 */
export default function postRoutesFactory(postController: PostController, middleware: {isAuthenticated: any}) {
    const router = express.Router();

    /**
     * @route GET /api/posts
     * @desc Récupère tous les posts de la communauté
     * @access Protected
     */
    router.get("/", middleware.isAuthenticated, postController.getAllPosts.bind(postController));

    return router;
}