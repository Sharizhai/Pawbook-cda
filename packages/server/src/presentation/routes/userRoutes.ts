import {UserController} from "$presentation/controllers/userController";
import express from "express";

/**
 * Routes pour la gestion des utilisateurs de Pawbook
 * @param userController - Contrôleur des users
 */
export default function userRoutesFactory(userController: UserController) {
    const router = express.Router();

    /**
     * @route POST /api/users/register
     * @desc Enregistre un nouvel utilisateur
     * @access Public
     */
    router.post("/register", userController.createUser.bind(userController));

    return router;
}