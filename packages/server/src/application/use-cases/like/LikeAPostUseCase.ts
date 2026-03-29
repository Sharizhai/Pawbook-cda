import {IPostLikeRepository} from "$domain/interfaces/repositories/like/postLikeRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {PostLikeDto, postLikeValidation} from "$presentation/dto/validation";
import {PostLike} from "$domain/entities/PostLike";

export class LikeAPostUseCase {
    constructor(
        private readonly postLikeRepository: IPostLikeRepository,
        private readonly userRepository: IUserRepository,
        private readonly postRepository: IPostRepository
    ) {
    }

    async execute(dto: PostLikeDto) {
        // 1. Normalisation des données
        const normalizedData = {
            ...dto,
            authorId: dto.authorId.trim(),
            postId: dto.postId.trim(),
        }

        // 2. Validation des données entrantes
        const validation = postLikeValidation.safeParse(normalizedData);
        if (!validation.success) {
            throw new Error(validation.error.issues[0].message);
        }

        const validData = validation.data;

        // 3. Vérification de l'existence du post et de l'utilisateur
        const post = await this.postRepository.findById(validData.postId);
        if (!post) {
            throw new Error("Post not found");
        }

        const author = await this.userRepository.findById(validData.authorId);
        if (!author) {
            throw new Error("User not found");
        }

        // 4. Vérification que le like n'existe pas déjà
        const existingLike = await this.postLikeRepository.findByAuthorAndPost(
            validData.authorId,
            validData.postId
        );
        if (existingLike) {
            throw new Error("You already liked this post");
        }

        // 5. Création du like
        const postlike = PostLike.create({
            authorId: validData.authorId,
            postId: validData.postId
        });

        // 6. Sauvegarde du like
        const savedPostLike = await this.postLikeRepository.save(postlike);

        // 7. Retour du like créé
        return savedPostLike;
    }
}