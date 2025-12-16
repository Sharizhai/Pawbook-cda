import {GetAllAnimalsByOwnerIdUseCase} from "$application/use-cases/animal/GetAllAnimalsByOwnerIdUseCase";
import {CreateAnimalProfileUseCase} from "$application/use-cases/animal/CreateAnimalProfileUseCase";
import {APIResponse} from "$utils/responseUtils.utils";
import {Request, Response} from "express";

export class AnimalController {
    constructor(
        private readonly createAnimalProfileUseCase: CreateAnimalProfileUseCase,
        private readonly getAllAnimalsByOwnerIdUseCase: GetAllAnimalsByOwnerIdUseCase
    ) {}

    /**
     * Crée un nouvel animal
     */

    async createAnimalProfile(req: Request, res: Response) {
        try {
            const animal = await this.createAnimalProfileUseCase.execute(req.body);

            return APIResponse(res, animal.toJSON(), "Nouveau profil d'animal créé avec succès", 201);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur lors de la création du nouveau profil d'animal";

            const status = this.getErrorStatus(error);

            return APIResponse(res, null, message, status);
        }
    }

    /**
     * Récupère tous les animaux d'un user à l'aide de son ID
     */
    async getAnimalsByOwnerId(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const page = Math.max(parseInt(req.query.page as string) || 0, 0);
            const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

            if(!id) return APIResponse(res, null, "ID de l'utilisateur requis", 400);

            const result = await this.getAllAnimalsByOwnerIdUseCase.execute(page, limit, id);

            return APIResponse(res, result, "Animaux récupérés avec succès")
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur lors de la récupération des animaux";

            const statusCode = message === "User not found" ? 404 : 500;

            return APIResponse(res, null, message, statusCode);
        }
    }

    private getErrorStatus(error: unknown): number {
        if (error instanceof Error) {
            if (error.message.includes("existe déjà")) return 409;
            if (error.message.includes("requis") ||
                error.message.includes("invalide")) return 400;
        }
        return 500;
    }
}