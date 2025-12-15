import {CreateAnimalProfileUseCase} from "$application/use-cases/animal/CreateAnimalProfileUseCase";
import {APIResponse} from "$utils/responseUtils.utils";
import {Request, Response} from "express";

export class AnimalController {
    constructor(
        private readonly createAnimalProfileUseCase: CreateAnimalProfileUseCase
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

    private getErrorStatus(error: unknown): number {
        if (error instanceof Error) {
            if (error.message.includes("existe déjà")) return 409;
            if (error.message.includes("requis") ||
                error.message.includes("invalide")) return 400;
        }
        return 500;
    }
}