import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {IPasswordServices} from "$domain/interfaces/passwordServices.interface";
import {PasswordUpdateDto, passwordUpdateValidation} from "$presentation/dto/validation";

export class UpdatePasswordUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordServices: IPasswordServices
    ) {}

    async execute(userId: string, dto: PasswordUpdateDto): Promise<void> {
        // 1. Vérification de l'existence de l'id de l'utilisateur'
        if (!userId) {
            throw new Error("User ID is required");
        }

        // 2. Validation des données entrantes
        const validation = passwordUpdateValidation.safeParse(dto);
        if (!validation.success) {
            throw new Error(validation.error.issues[0].message);
        }

        // 3. Vérification de l'existence d'un utilisateur avec cet id
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // 4. Vérification du mot de passe actuel
        const isCurrentPasswordValid = await this.passwordServices.verifyPassword(
            dto.currentPassword,
            user.password
        );

        if (!isCurrentPasswordValid) {
            throw new Error("Invalid password");
        }

        // 5. Hashage du nouveau mot de passe
        const hashedNewPassword = await this.passwordServices.hashPassword(dto.newPassword);

        // 6. Mise à jour du mot de passe de l'utilisateur
        return await this.userRepository.updatePassword(userId, hashedNewPassword);
    }
}