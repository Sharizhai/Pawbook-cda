import {UpdateUserProfileUseCase} from "$application/use-cases/user/UpdateUserProfileUseCase";
import {GetUserByIdUseCase} from "$application/use-cases/user/GetUserByIdUseCase";
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
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly updateUserProfileUseCase: UpdateUserProfileUseCase
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

    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (Array.isArray(id)) {
                return APIResponse(res, null, "Invalid user ID parameter", 400);
            }

            const user = await this.getUserByIdUseCase.execute(id);

            return APIResponse(res, user, "Utilisateur trouvé", 200);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur lors de la récupération de l'utilisateur";

            const status = this.getErrorStatus(error);

            return APIResponse(res, null, message, status);
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (Array.isArray(id)) {
                return APIResponse(res, null, "Invalid user ID parameter", 400);
            }

            const user = await this.updateUserProfileUseCase.execute(id, req.body);
            return APIResponse(res, user, "Utilisateur mis à jour", 200);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur lors de la mise à jour de l'utilisateur";

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