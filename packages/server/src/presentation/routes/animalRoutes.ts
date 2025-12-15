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
     * @access Public
     */
    router.post("/register", middleware.isAuthenticated, animalController.createAnimalProfile.bind(animalController));

    return router;
}