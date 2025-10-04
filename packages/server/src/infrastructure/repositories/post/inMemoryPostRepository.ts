import {IPostRepository} from "$domain/interfaces/postRepository.interface";
import {Post, PostData} from "$domain/entities/Posts";
import {IUserRepository} from "$domain/interfaces/userRepository.interface";
import {ILikeRepository} from "$domain/interfaces/likeRepository.interface";
import {ICommentRepository} from "$domain/interfaces/commentRepository.interface";

export class InMemoryPostRepository implements IPostRepository {
    private posts: Post[] = [];
    private userRepository?: IUserRepository;
    private likeRepository?: ILikeRepository;
    private commentRepository?: ICommentRepository;

    setUserRepository(repo: IUserRepository): void {
        this.userRepository = repo;
    }

    setLikeRepository(repo: ILikeRepository): void {
        this.likeRepository = repo;
    }

    setCommentRepository(repo: ICommentRepository): void {
        this.commentRepository = repo;
    }

    async findAll(skip: number, limit: number): Promise<Post[]> {
        const sorted = [...this.posts].sort((a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );

        const paginated = sorted.slice(skip, skip + limit);

        return await this.populatePosts(paginated);
    }

    async findById(id: string): Promise<Post | null> {
        const post = this.posts.find(post => post.id === id);
        if (!post) return null;

        const populated = await this.populatePosts([post]);
        return populated[0];
    }

    async findByAuthorId(authorId: string, skip: number, limit: number): Promise<Post[]> {
        const filtered = this.posts.filter(post => post.authorId === authorId);
        const sorted = filtered.sort((a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );
        const paginated = sorted.slice(skip, skip + limit);

        return await this.populatePosts(paginated);
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

    private async populatePosts(posts: Post[]): Promise<Post[]> {
        if (!this.userRepository || !this.likeRepository || !this.commentRepository) {
            return posts;
        }

        return Promise.all(posts.map(async (post) => {
            const postData = { ...post };

            if (typeof post.authorId === 'string') {
                const author = await this.userRepository!.findById(post.authorId);
                if (author) {
                    postData.authorId = {
                        id: author.id,
                        name: author.name,
                        firstName: author.firstName,
                        profilePicture: author.profilePicture
                    };
                }
            }

            if (Array.isArray(post.likes)) {
                postData.likes = await Promise.all(
                    post.likes.map(async (likeId) => {
                        if (typeof likeId === 'string') {
                            const like = await this.likeRepository!.findById(likeId);
                            if (like) {
                                const likeAuthor = await this.userRepository!.findById(
                                    typeof like.authorId === 'string' ? like.authorId : like.authorId.id
                                );
                                return {
                                    ...like,
                                    authorId: likeAuthor ? {
                                        id: likeAuthor.id,
                                        name: likeAuthor.name,
                                        firstName: likeAuthor.firstName,
                                        profilePicture: likeAuthor.profilePicture
                                    } : like.authorId
                                };
                            }
                        }
                        return likeId;
                    })
                );
            }

            if (Array.isArray(post.comments)) {
                postData.comments = await Promise.all(
                    post.comments.map(async (commentId) => {
                        if (typeof commentId === 'string') {
                            const comment = await this.commentRepository!.findById(commentId);
                            if (comment) {
                                const commentAuthor = await this.userRepository!.findById(
                                    typeof comment.authorId === 'string' ? comment.authorId : comment.authorId.id
                                );
                                return {
                                    ...comment,
                                    authorId: commentAuthor ? {
                                        id: commentAuthor.id,
                                        name: commentAuthor.name,
                                        firstName: commentAuthor.firstName,
                                        profilePicture: commentAuthor.profilePicture
                                    } : comment.authorId
                                };
                            }
                        }
                        return commentId;
                    })
                );
            }

            return new Post(postData as PostData);
        }));
    }
}