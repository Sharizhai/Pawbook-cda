import {UserController} from "$presentation/controllers/userController";
import express from "express";

/**
 * Routes pour la gestion des utilisateurs de Pawbook
 * @param userController - Contrôleur des users
 * @param middleware - Middleware
 */
export default function userRoutesFactory(userController: UserController, middleware: {isAuthenticated: any}) {
    const router = express.Router();

    /**
     * @route POST /api/users/register
     * @desc Enregistre un nouvel utilisateur
     * @access Public
     */
    router.post("/register", userController.createUser.bind(userController));

    /**
     * @route GET /api/users/:id
     * @desc Trouve un utilisateur par son ID
     * @access Protected
     */
    router.get("/:id", middleware.isAuthenticated , userController.getUserById.bind(userController));

    /**
     * @route PATCH /api/users/:id
     * @desc Met à jour les informations d'un utilisateur'
     * @access Protected
     */
    router.patch("/:id", middleware.isAuthenticated , userController.updateUser.bind(userController));

    return router;
}