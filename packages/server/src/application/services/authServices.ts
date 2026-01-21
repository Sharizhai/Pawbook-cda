import {IPasswordServices} from "$domain/interfaces/passwordServices.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {IAuthServices} from "$domain/interfaces/authServices.interface";
import {ITokenPayload} from "$domain/interfaces/tokenPayload.interface";
import {IJwtServices} from "$domain/interfaces/jwtServices.interface";
import {LoginDto} from "$presentation/dto/validation";

export class AuthServices implements IAuthServices {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly argon2Services: IPasswordServices,
        private readonly jwtAuthService: IJwtServices,
    ) {}

    async login(credentials: LoginDto): Promise<{ token: string, refreshToken: string }> {
        if (!credentials.email || !credentials.password) {
            throw new Error("E-mail et mot de passe requis");
        }

        const user = await this.userRepository.findByEmail(credentials.email);

        if (!user) {
            console.error("[AuthService] Aucun utilisateur trouvé pour:", credentials.email);
            throw new Error("Pas de compte trouvé pour cet e-mail");
        }

        const isPasswordValid = await this.argon2Services.verifyPassword(
            credentials.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new Error("Mot de passe invalide");
        }

        const payload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            name: user.name,
            role: user.role,
        };

        const refreshPayload = {
            id: user.id,
        };

        const token = this.jwtAuthService.generateToken(payload);
        const refreshToken = this.jwtAuthService.generateRefreshToken(refreshPayload);

        return { token, refreshToken };
    }

    async logout(token: string): Promise<void> {
        try {
            this.jwtAuthService.verifyToken(token);

        } catch (error) {

        }
    }

    async refreshToken(refreshToken: string): Promise<string> {
        try {
            const payload = this.jwtAuthService.verifyRefreshToken(refreshToken);

            if (!payload || !payload.id) {
                throw new Error("Refresh token invalide");
            }

            const user = await this.userRepository.findById(payload.id);

            if (!user) {
                throw new Error("Utilisateur non trouvé");
            }

            const newToken = this.jwtAuthService.generateToken({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                name: user.name,
                role: user.role,
            });

            return newToken;
        } catch (error) {
            throw new Error("Impossible de rafraîchir le token");
        }
    }

    verifyToken(token: string): ITokenPayload | null {
        try {
            return this.jwtAuthService.verifyToken(token);
        } catch {
            return null;
        }
    }

    isTokenValid(token: string): boolean {
        return this.verifyToken(token) !== null;
    }
}