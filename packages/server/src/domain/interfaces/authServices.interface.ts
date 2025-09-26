import {ITokenPayload} from "$domain/interfaces/tokenPayload.interface";
import {LoginDto} from "$presentation/dto/validation";

export interface IAuthServices {
    /**
     * Authentifie un utilisateur avec ses identifiants
     * @param credentials validation zod
     * @returns Token JWT si l'authentification réussit
     * @throws Error si les identifiants sont invalides
     */
    login(credentials: LoginDto): Promise<string>;

    /**
     * Vérifie et décode un token JWT
     * @param token Token JWT à vérifier
     * @returns Payload du token si valide
     * @throws Error si le token est invalide ou expiré
     */
    verifyToken(token: string): ITokenPayload | null;

    /**
     * Déconnecte un utilisateur (invalide le token côté serveur si nécessaire)
     * @param token Token à invalider
     * @returns Promise<void>
     */
    logout(token: string): Promise<void>;

    /**
     * Rafraîchit un token JWT
     * @param refreshToken Token de rafraîchissement
     * @returns Nouveau token d'accès
     * @throws Error si le refresh token est invalide
     */
    refreshToken?(refreshToken: string): Promise<string>;

    /**
     * Vérifie si un token est valide sans lever d'exception
     * @param token Token à vérifier
     * @returns true si le token est valide, false sinon
     */
    isTokenValid?(token: string): boolean;
}