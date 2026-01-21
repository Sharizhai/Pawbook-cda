import {IRefreshTokenPayload, ITokenPayload} from "$domain/interfaces/tokenPayload.interface";

export interface IJwtServices {
    /**
     * Génère un token JWT
     * @param payload - Données à encoder dans le token
     * @returns Token JWT signé
     */
    generateToken(payload: ITokenPayload): string;

    /**
     * Génère un refresh token JWT avec une durée de vie plus longue
     * @param payload - Données à encoder dans le token
     * @returns Refresh token JWT signé
     */
    generateRefreshToken(payload: IRefreshTokenPayload): string;

    /**
     * Vérifie et décode un token JWT
     * @param token - Token JWT à vérifier
     * @returns Payload décodé
     * @throws Error si le token est invalide
     */
    verifyToken(token: string): ITokenPayload;

    /**
     * Vérifie et décode un refresh token JWT
     * @param token - Refresh token JWT à vérifier
     * @returns Payload décodé
     * @throws Error si le token est invalide
     */
    verifyRefreshToken(token: string): IRefreshTokenPayload;

    /**
     * Extrait le token d'un header Authorization
     * @param authHeader - Header Authorization (format: "Bearer <token>")
     * @returns Token extrait ou null si format invalide
     */
    extractTokenFromHeader(authHeader: string): string | null;
}