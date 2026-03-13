import {UserCreationDto, userCreationValidation} from "$presentation/dto/validation";
import {IPasswordServices} from "$domain/interfaces/passwordServices.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {User} from "$domain/entities/Users";
import {IEmailServices} from "$domain/interfaces/emailServices.interface";

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordServices: IPasswordServices,
        private readonly emailServices: IEmailServices,
    ) {}

    async execute(dto: UserCreationDto): Promise<User> {
        // 1. Normalisation des données
        const normalizedData = {
            ...dto,
            firstName: dto.firstName.trim(),
            name: dto.name.trim(),
            email: dto.email.trim().toLowerCase(),
        };

        // 2. Validation des données entrantes
        const validation = userCreationValidation.safeParse(normalizedData);
        if (!validation.success) {
            throw new Error(validation.error.issues[0].message);
        }

        const validData = validation.data;

        // 3. Vérification de l'existence d'un utilisateur avec cette adresse email
        const existingUser = await this.userRepository.findByEmail(validData.email);
        if (existingUser) {
            throw new Error("Cette adresse email existe déjà");
        }

        // 4. Hashage du mot de passe
        const hashedPassword = await this.passwordServices.hashPassword(validData.password);

        // 5. Création de l'utilisateur'
        const user = User.create({
            firstName: validData.firstName,
            name: validData.name,
            email: validData.email,
            password: hashedPassword,
            role: validData.role || "USER",
            profilePicture: validData.profilePicture,
            profileDescription: validData.profileDescription,
        });

        // 6.Envoi d'un email de confirmation
        await this.emailServices.sendConfirmationEmail(user.email, user.firstName);

        // 7. Sauvegarde
        return await this.userRepository.save(user);
    }
}