import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {Post} from "$domain/entities/Posts";

export class GetAllPostsByAuthorIdUseCase {
    constructor(
        private readonly postRepository: IPostRepository,
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(page: number, limit: number, authorId: string): Promise<{ posts: Post[], hasMore: boolean }> {
        const posts = await this.postRepository.findByAuthorId(authorId, page, limit + 1);

        const hasMore = posts.length > limit;
        const postsToReturn = hasMore ? posts.slice(0, limit) : posts;

        return { posts: postsToReturn, hasMore };
    }
}