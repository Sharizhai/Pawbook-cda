import {IFollowRepository} from "$domain/interfaces/repositories/followRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {FollowCreationDto, followCreationValidation} from "$presentation/dto/validation";
import {Follow} from "$domain/entities/Follows";

export class FollowAUserUseCase {
    constructor(
        private readonly followRepository: IFollowRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async execute(dto: FollowCreationDto) {
        // 1. Normalisation des données
        const normalizedData = {
            ...dto,
            followerId: dto.followerId.trim(),
            followingId: dto.followingId.trim(),
        }

        // 2. Validation des données entrantes
        const validation = followCreationValidation.safeParse(normalizedData);
        if (!validation.success) {
            throw new Error(validation.error.issues[0].message);
        }

        const validData = validation.data;

        // 3. Vérification de l'existence des deux utilisateurs
        const follower = await this.userRepository.findById(validData.followerId);
        if (!follower) {
            throw new Error("Follower user not found");
        }

        const following = await this.userRepository.findById(validData.followingId);
        if (!following) {
            throw new Error("User to follow not found");
        }

        // 4. Vérification que le follow n'existe pas déjà
        const existingFollow = await this.followRepository.findByUsers(
            validData.followerId,
            validData.followingId
        );
        if (existingFollow) {
            throw new Error("Vous suivez déjà cet utilisateur");
        }

        // 5. Création du follow
        const follow = Follow.create(validData.followerId, validData.followingId);

        // 6. Sauvegarde du follow
        const savedFollow = await this.followRepository.save(follow);

        // 7. Retour du follow créé
        return savedFollow;
    }
}