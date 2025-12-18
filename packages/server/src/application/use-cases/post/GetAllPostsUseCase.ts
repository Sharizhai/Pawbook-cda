import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {Post} from "$domain/entities/Posts";

export class GetAllPostsUseCase {
    constructor(private readonly postRepository: IPostRepository) {}

    async execute(page: number, limit: number): Promise<{ posts: Post[], hasMore: boolean }> {
        const posts = await this.postRepository.findAll(page, limit + 1);

        const hasMore = posts.length > limit;
        const postsToReturn = hasMore ? posts.slice(0, limit) : posts;

        return { posts: postsToReturn, hasMore };
    }
}