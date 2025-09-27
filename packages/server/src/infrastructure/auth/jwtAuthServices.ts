import {ITokenPayload} from "$domain/interfaces/tokenPayload.interface";
import {IJwtServices} from "$domain/interfaces/jwtServices.interface";
import jwt, {Secret, SignOptions} from 'jsonwebtoken';

export class JwtAuthService implements IJwtServices {
    constructor(
        private readonly secret: Secret,
        private readonly expiresIn: SignOptions['expiresIn'],
        private readonly jwtLib = jwt
    ) {
        if (!secret) throw new Error("JWT_SECRET is required");
        if (!expiresIn) throw new Error("JWT_EXPIRATION_SECRET is required");
    }

    /**
     * Génère un token JWT pour un payload donné
     */
    generateToken(payload: ITokenPayload): string {
        if (!payload) throw new Error("Payload is required");

        return this.jwtLib.sign({...payload, jti: crypto.randomUUID()}, this.secret, {
            expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'],
        });
    }

    /**
     * Vérifie et décode un token JWT
     */
    verifyToken(token: string): ITokenPayload {
        try {
            const decoded = jwt.verify(token, this.secret) as ITokenPayload;
            return decoded;
        } catch (error) {
            if (error instanceof Error) throw new Error(`Invalid JWT token: ${error.message}`);

            throw new Error("Invalid JWT token: Unknown error");
        }
    }

    /**
     * Extrait le token d'un header Authorization
     */
    extractTokenFromHeader(authHeader: string): string | null {
        if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

        const token = authHeader.substring(7).trim();

        return token || null;
    }
}