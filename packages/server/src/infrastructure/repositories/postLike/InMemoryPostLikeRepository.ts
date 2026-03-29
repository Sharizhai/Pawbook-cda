import {IPostLikeRepository} from "$domain/interfaces/repositories/like/postLikeRepository.interface";
import {PostLike, PostLikeData} from "$domain/entities/PostLike";

export class InMemoryPostLikeRepository implements IPostLikeRepository {
    private postlikes: PostLike[] = [];

    async findAllByPostId(postId: string): Promise<PostLike[]> {
        return this.postlikes.filter(like => like.postId === postId);
    }

    async findById(id: string): Promise<PostLike | null> {
        const like = this.postlikes.find(like => like.id === id);

        return like ? new PostLike(like) : null;
    }

    async findByAuthorAndPost(authorId:string, postId:string): Promise<PostLike | null> {
        const like = this.postlikes.find(like => like.authorId === authorId && like.postId === postId);

        return like ? new PostLike(like) : null;
    }

    async save(likeData: PostLikeData): Promise<PostLike> {
        const like = new PostLike(likeData);
        this.postlikes.push(like);
        return Promise.resolve(like);
    }

    async delete(id: string): Promise<boolean> {
        const index = this.postlikes.findIndex(like => like.id === id);
        if (index !== -1) {
            this.postlikes.splice(index, 1);
            return true;
        }
        return false;
    }

    async count(): Promise<number> {
        return Promise.resolve(this.postlikes.length);
    }

    async countByPostId(postId: string): Promise<number> {
        return Promise.resolve(this.postlikes.filter(like => like.postId === postId).length);
    }

    async countByAuthorId(authorId: string): Promise<number> {
        return Promise.resolve(this.postlikes.filter(like => like.authorId === authorId).length);
    }
}