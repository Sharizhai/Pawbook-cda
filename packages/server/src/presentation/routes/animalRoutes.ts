import {AnimalController} from "$presentation/controllers/animalController";
import express from "express";

/**
 * Routes pour la gestion des animaux de Pawbook
 * @param animalController - Contrôleur des animaux
 * @param middleware - Middleware
 */
export default function animalRoutesFactory(animalController: AnimalController, middleware: {isAuthenticated: any}) {
    const router = express.Router();

    /**
     * @route POST /api/animals/register
     * @desc Enregistre un nouvel animal
     * @access Protected
     */
    router.post("/register", middleware.isAuthenticated, animalController.createAnimalProfile.bind(animalController));

    /**
     * @route GET /api/animals/:id
     * @desc Récupère tous les animaux d'un user à l'aide de son ID
     * @access Protected
     */
    router.get("/:id", middleware.isAuthenticated, animalController.getAnimalsByOwnerId.bind(animalController));

    return router;
}