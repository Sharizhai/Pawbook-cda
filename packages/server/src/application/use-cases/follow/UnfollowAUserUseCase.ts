import {IFollowRepository} from "$domain/interfaces/repositories/followRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {followDeletionValidation, FollowDeletionDto} from "$presentation/dto/validation";

export class UnfollowAUserUseCase {
    constructor(
        private readonly followRepository: IFollowRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async execute(dto: FollowDeletionDto) {
        // 1. Normalisation des données
        const normalizedData = {
            ...dto,
            followerId: dto.followerId.trim(),
            followingId: dto.followingId.trim(),
        }

        // 2. Validation des données entrantes
        const validation = followDeletionValidation.safeParse(normalizedData);
        if (!validation.success) {
            throw new Error(validation.error.errors[0].message);
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

        // 4. Vérification que le follow existe
        const existingFollow = await this.followRepository.findByUsers(
            validData.followerId,
            validData.followingId
        );
        if (!existingFollow) {
            throw new Error("Vous ne suivez pas cet utilisateur");
        }

        // 5. Suppression du follow
        const deletedFollow  = await this.followRepository.deleteByUsers(validData.followerId, validData.followingId);

        if (!deletedFollow) {
            throw new Error("Erreur lors de la suppression du follow");
        }

        // 6. Retour du follow supprimé
        return existingFollow ;
    }
}