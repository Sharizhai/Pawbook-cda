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

    return router;
}