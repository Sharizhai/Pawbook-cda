import {UserController} from "$presentation/controllers/userController";
import express from "express";

/**
 * Routes pour la gestion des posts du coworking
 * @param userController - Contrôleur des posts
 */
export default function userRoutesFactory(userController: UserController) {
    const router = express.Router();

    /**
     * @route GET /api/users/register
     * @desc Enregistre un nouvel utilisateur
     * @access Public
     */
    router.post("/register", userController.createUser.bind(userController));

    return router;
}