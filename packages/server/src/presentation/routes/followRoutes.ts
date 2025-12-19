import {FollowController} from "$presentation/controllers/followController";
import express from "express";

/**
 * Routes pour la gestion des follows de Pawbook
 * @param followController - Contrôleur des follows
 * @param middleware - Middleware
 */
export default function followRoutesFactory(followController: FollowController, middleware: {isAuthenticated: any}) {
    const router = express.Router();

    /**
     * @route POST /api/follows/register
     * @desc Enregistre une nouvelle relation de follow entre deux utilisateurs
     * @access Protected
     */
    router.post("/register", middleware.isAuthenticated, followController.createFollow.bind(followController));

    /**
     * @route DELETE /api/follows/delete
     * @desc Supprime une relation de follow entre deux utilisateurs
     * @access Protected
     */
    router.delete("/:followingId", middleware.isAuthenticated, followController.deleteFollow.bind(followController));

    return router;
}