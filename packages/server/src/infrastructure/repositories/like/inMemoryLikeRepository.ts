import {ILikeRepository} from "$domain/interfaces/repositories/likeRepository.interface";
import {Like, LikeData} from "$domain/entities/Likes";

export class InMemoryLikeRepository implements ILikeRepository {
    private likes: Like[] = [];

    async findAllByPostId(postId: string): Promise<Like[]> {
        return this.likes.filter(like => like.postId === postId);
    }

    async findAllByAnimalId(animalId: string): Promise<Like[]> {
        return this.likes.filter(like => like.animalId === animalId);
    }

    async findById(id: string): Promise<Like | null> {
        const like = this.likes.find(like => like.id === id);

        return like ? new Like(like) : null;
    }

    async create(likeData: LikeData): Promise<Like> {
        const like = new Like(likeData);
        this.likes.push(like);
        return Promise.resolve(like);
    }

    async delete(id: string): Promise<boolean> {
        const index = this.likes.findIndex(like => like.id === id);
        if (index !== -1) {
            this.likes.splice(index, 1);
            return true;
        }
        return false;
    }

    async count(): Promise<number> {
        return Promise.resolve(this.likes.length);
    }

    async countByPostId(postId: string): Promise<number> {
        return Promise.resolve(this.likes.filter(like => like.postId === postId).length);
    }

    async countByAnimalId(animalId: string): Promise<number> {
        return Promise.resolve(this.likes.filter(like => like.postId === animalId).length);
    }

    async countByAuthorId(authorId: string): Promise<number> {
        return Promise.resolve(this.likes.filter(like => like.postId === authorId).length);
    }
}