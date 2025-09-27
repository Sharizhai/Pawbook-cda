import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import {IAuthServices} from "$domain/interfaces/authServices.interface";
import {APIResponse} from "$utils/responseUtils.utils";
import { NextFunction, Request, Response } from "express";
import { User } from "$domain/entities/Users";

/**
 * Extension of the Request interface to include the member
 */
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const makeAuthMiddleware = (authService: IAuthServices, userRepository: IUserRepository) => {
    /**
     * Check if the user is authenticated
     * */
    const isAuthenticated = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                APIResponse(res, null, "Unauthorized - Authentication token required", 401);
                return;
            }

            const token = authHeader.split(" ")[1];
            const decoded = authService.verifyToken(token);

            const user = await userRepository.findById(decoded!.id);

            if (!user) {
                APIResponse(res, null, "User not found", 401);
                return;
            }

            req.user = user;
            next();
        } catch (error) {
            console.error("Authentication error:", error);

            const errorData = process.env.NODE_ENV === "development"
                ? { error: (error as Error).message }
                : null;

            APIResponse(res, errorData, "Unauthorized - Invalid token", 401);
        }
    };

    /**
     * Check if the user is an administrator
     */
    const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            APIResponse(res, null, "Unauthorized", 401);
            return;
        }

        if (!req.user.isAdmin()) {
            APIResponse(res, null, "Forbidden", 403);
            return;
        }

        next();
    };

    /**
     * Check if the current member can modify the data of another member
     * (either it is his own data, or he is admin or moderator)
     *
     */
    const canModifyUser = (req: Request, res: Response, next: NextFunction): void => {
        const targetUserId = req.params.id;
        const currentUser = req.user;

        if (!currentUser) {
            APIResponse(res, null, "Unauthorized", 401);
            return;
        }

        if (!currentUser.canModifyUser(targetUserId)) {
            APIResponse(res, null, "Forbidden", 403);
            return;
        }

        next();
    };

    return { isAuthenticated, isAdmin, canModifyUser };
};