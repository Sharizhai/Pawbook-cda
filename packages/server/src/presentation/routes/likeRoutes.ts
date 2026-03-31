import {LikeController} from "$presentation/controllers/likeController";
import express from "express";

/**
 * Routes pour la gestion des likes de Pawbook
 * @param likeController - Contrôleur des likes
 * @param middleware - Middleware
 */
export default function likeRoutesFactory(likeController: LikeController, middleware: {isAuthenticated: any}) {
    const router = express.Router();

    /**
     * @route POST /api/likes/:postId
     * @desc Enregistre une nouvelle relation de like d'un utilisateur envers un post
     * @access Protected
     */
    router.post("/:postId", middleware.isAuthenticated, likeController.likePost.bind(likeController));

    /**
     * @route DELETE /api/likes/:postId
     * @desc Supprime une relation de like d'un utilisateur envers un post
     * @access Protected
     */
    router.delete("/:postId", middleware.isAuthenticated, likeController.unlikePost.bind(likeController));

    /**
     * @route GET /api/likes/:id
     * @desc Récupère tous les likes de post d'un user à l'aide de son ID
     * @access Protected
     */
    router.get("/", middleware.isAuthenticated, likeController.getAllPostLikesByAuthorId.bind(likeController));

    return router;
}