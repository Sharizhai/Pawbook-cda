import {IPostRepository} from "$domain/interfaces/postRepository.interface";
import {Post} from "$domain/entities/Posts";

export class GetAllPostsUseCase {
    constructor(private readonly postRepository: IPostRepository) {}

    async execute(skip: number, limit: number): Promise<Post[]> {
        return await this.postRepository.findAll(skip, limit);
    }
}