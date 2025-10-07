import {CreateUserUseCase} from "$application/use-cases/user/CreateUserUseCase";
import {APIResponse} from "$utils/responseUtils.utils";
import {Request, Response} from "express";

/**
 * UserController - Couche Présentation
 * Gère les requêtes HTTP relatives aux users de Pawbook
 */

export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
    ) {}

    /**
     * Crée un nouvel utilisateur
     */
    async createUser(req: Request, res: Response) {
        try {
            const user = await this.createUserUseCase.execute(req.body);

            return APIResponse(res, user.toJSON(), "Utilisateur créé avec succès", 201);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur lors de la création de l'utilisateur";

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