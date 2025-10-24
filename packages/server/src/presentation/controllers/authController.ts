import {IAuthServices} from "$domain/interfaces/authServices.interface";
import {LoginDto, loginValidation} from "$presentation/dto/validation";
import {APIResponse} from "$utils/responseUtils.utils";
import { Request, Response } from 'express';
import {User} from "$domain/entities/Users";

export class AuthController {
    constructor(private readonly authService: IAuthServices) {}

    /**
     * Authenticates a user and returns a JWT token
     * @route POST /api/auth/login
     */
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const validateData: LoginDto = loginValidation.parse(req.body);

            if (!validateData) {
                APIResponse(res, null, 'Email et mot de passe requis.', 400);
                return;
            }

            const token = await this.authService.login(validateData);

            res.cookie("accessToken", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000, // 24h en ms
            });

            APIResponse(res, { token }, "Connexion réussie", 200);
        } catch (error) {
            console.error('[AuthController] Login error:', error);
            APIResponse(res, null, 'Identifiants invalides', 401);
        }
    };

    /**
     * Déconnecte l’utilisateur (supprime le cookie JWT)
     * @route POST /api/auth/logout
     */
    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies?.jwt ?? req.cookies?.accessToken;

            if (token) {
                await this.authService.logout(token); // éventuellement : invalider le token côté serveur si nécessaire
            }

            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                domain: 'localhost',
            });

            APIResponse(res, null, 'Déconnexion réussie', 200);
        } catch (error) {
            console.error('[AuthController] Logout error:', error);
            APIResponse(res, null, 'Erreur lors de la déconnexion', 500);
        }
    };

    /**
     * Return the authenticated member's information'
     * @route GET /api/auth/me
     */
    me = async (req: Request, res: Response): Promise<void> => {
        const user: User | undefined = req.user;

        if (!user) {
            APIResponse(res, null, 'Non authentifié', 401);
            return;
        }

        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        APIResponse(res, user.toJSON(), 'Utilisateur récupéré avec succès');
    };
}