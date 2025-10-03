import {IPostRepository} from "$domain/interfaces/postRepository.interface";
import {Post, PostData} from "$domain/entities/Posts";

export class InMemoryPostRepository implements IPostRepository {
    private posts: Post[] = [];

    async findAll(): Promise<Post[]> {
        return Promise.resolve(this.posts);
    }

    async findById(id: string): Promise<Post | null> {
        return Promise.resolve(this.posts.find(post => post.id === id) || null);
    }

    async findByAuthorId(authorId: string): Promise<Post[]> {
        return Promise.resolve(this.posts.filter(post => post.authorId === authorId));
    }

    async create(postData: PostData): Promise<Post> {
        const post = new Post(postData);

        this.posts.push(post);

        return Promise.resolve(post);
    }

    async update(id: string, postData: Partial<PostData>): Promise<Post | null> {
        const index = this.posts.findIndex(post => post.id === id);

        if (index === -1) return Promise.resolve(null);

        const existing = this.posts[index];
        const updated = new Post({ ...existing, ...postData });

        this.posts[index] = updated;

        return Promise.resolve(updated);
    }

    async delete(id: string): Promise<boolean> {
        const index = this.posts.findIndex(post => post.id === id);

        if (index === -1) return Promise.resolve(false);

        this.posts.splice(index, 1);

        return Promise.resolve(true);
    }

    async count(): Promise<number> {
        return Promise.resolve(this.posts.length);
    }
}