import {PostController} from "$presentation/controllers/postController";
import express from "express";

/**
 * Routes pour la gestion des posts de Pawbook
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

    /**
     * @route GET /api/posts/:id
     * @desc Récupère tous les posts d'un user à l'aide de son ID'
     * @access Protected
     */
    router.get("/:id", middleware.isAuthenticated, postController.getPostById.bind(postController));

    /**
     * @route POST /api/posts/create
     * @desc Enregistre un nouveau post
     * @access Protected
     */
    router.post("/create", middleware.isAuthenticated, postController.createPost.bind(postController));

    return router;
}