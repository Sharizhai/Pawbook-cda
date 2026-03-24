import {SearchController} from "$presentation/controllers/searchController";
import express from "express";

/**
 * Routes pour la gestion des recherches sur Pawbook
 * @param searchController - Contrôleur des recherches
 * @param middleware - Middleware
 */

export default function searchRoutesFactory(searchController: SearchController, middleware: {isAuthenticated: any}) {
    const router = express.Router();

    /**
     * @route GET /api/search/register
     * @desc Recherche un utilisateur ou un animal par son nom/prénom
     * @access Protected
     */
    router.get("/", middleware.isAuthenticated, searchController.searchUserOrPet.bind(searchController));

    return router;
}