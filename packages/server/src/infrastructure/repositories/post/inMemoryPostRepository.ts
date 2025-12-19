import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {Post, PostData} from "$domain/entities/Posts";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";

export class InMemoryPostRepository implements IPostRepository {
    private posts: Post[] = [];
    private userRepository?: IUserRepository;

    setUserRepository(repo: IUserRepository): void {
        this.userRepository = repo;
    }

    async findAll(page: number, limit: number): Promise<Post[]> {
        const sorted = [...this.posts].sort((a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );

        const paginated = sorted.slice(page, page + limit);

        return await this.populatePosts(paginated);
    }

    async findById(id: string): Promise<Post | null> {
        const post = this.posts.find(post => post.id === id);
        if (!post) return null;

        const populated = await this.populatePosts([post]);
        return populated[0];
    }

    async findByAuthorId(authorId: string, page: number, limit: number): Promise<Post[]> {
        const filtered = this.posts.filter(post => post.authorId === authorId);
        const sorted = filtered.sort((a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );
        const paginated = sorted.slice(page, page + limit);

        return await this.populatePosts(paginated);
    }

    async save(postData: PostData): Promise<Post> {
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

    private async populatePosts(posts: Post[]): Promise<Post[]> {
        if (!this.userRepository) {
            return posts;
        }

        return Promise.all(
            posts.map(async (post) => {
                let author;

                if (post.authorId) {
                    const user = await this.userRepository!.findById(post.authorId);
                    if (user) {
                        author = {
                            id: user.id,
                            name: user.name,
                            firstName: user.firstName,
                            profilePicture: user.profilePicture
                        };
                    }
                }

                return new Post({
                    ...post,
                    author
                });
            })
        );
    }
}