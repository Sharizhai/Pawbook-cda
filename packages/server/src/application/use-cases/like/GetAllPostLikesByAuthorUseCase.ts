import {IPostLikeRepository} from "$domain/interfaces/repositories/like/postLikeRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";

export class GetAllPostLikesByAuthorUseCase {
    constructor(
        private readonly postLikeRepository: IPostLikeRepository,
        private readonly userRepository: IUserRepository,
        private readonly postRepository: IPostRepository
    ) {
    }

    async execute(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        return await this.postLikeRepository.findAllByAuthorId(userId);
    }
}