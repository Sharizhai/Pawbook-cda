import jwt from 'jsonwebtoken';
import { env } from '$config/env';
import { UserRepository } from '$domain/interfaces/UserRepository';

const JWT_SECRET = env.JWT_SECRET as jwt.Secret;
if (!env.JWT_SECRET) {
    console.warn(
        '[WARNING] JWT_SECRET is not defined in .env — using default value. ⚠️',
    );
}
const JWT_EXPIRES_IN = env.JWT_EXPIRATION_SECRET as jwt.SignOptions['expiresIn'];

export class JwtAuthService {
    constructor(private readonly UserRepository: UserRepository) {}

    /**
     * Génère un token JWT pour un membre authentifié
     */

    generateToken(payload: {
        id: string;
        email: string;
        firstName: string;
        name: string;
        role: string;
    }): string {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
    }

    /**
     * Vérifie et décode un token JWT
     */
    verifyToken(token: string): {
        id: string;
        email: string;
        firstName: string;
        name: string;
        role: string;
    } {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            email: string;
            firstName: string;
            name: string;
            role: string;
        };

        return decoded;
    }

    /**
     * Vérifie les identifiants et retourne le token si tout est bon
     */
    async login(
        email: string,
        password: string,
        bcryptService: { compare: (p: string, h: string) => Promise<boolean> },
    ): Promise<string | null> {
        const user = await this.UserRepository.findByEmail(email);
        if (!user) return null;

        const isValid = await bcryptService.compare(password, user.password);
        if (!isValid) return null;

        return this.generateToken(user);
    }
}
