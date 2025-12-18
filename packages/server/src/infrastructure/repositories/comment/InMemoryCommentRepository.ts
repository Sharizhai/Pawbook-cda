import {ICommentRepository} from "$domain/interfaces/repositories/commentRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {Comment, CommentData} from "$domain/entities/Comments";

export class InMemoryCommentRepository implements ICommentRepository {
    private comments: Comment[] = [];
    private userRepository?: IUserRepository;
    private postRepository?: IPostRepository;

    setUserRepository(repo: IUserRepository): void {
        this.userRepository = repo;
    }

    setPostRepository(repo: IPostRepository): void {
        this.postRepository = repo;
    }

    async findAllByAuthorId(authorId:string): Promise<Comment[]> {
        const filtered = this.comments.filter(comment => comment.authorId === authorId);
        const sorted = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return await this.populateComments(sorted);
    }

    async findAllByPostId(postId:string): Promise<Comment[]> {
        const filtered = this.comments.filter(comment => comment.postId === postId);
        const sorted = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return await this.populateComments(sorted);
    }

    async findById(id:string): Promise<Comment | null> {
        const comment = this.comments.find(comment => comment.id === id);
        if (!comment) return null;

        const populated = await this.populateComments([comment]);
        return populated[0];
    }

    async create(commentData: CommentData): Promise<Comment> {
        const comment = new Comment(commentData);
        this.comments.push(comment);
        return Promise.resolve(comment);
    }

    async update(id:string, commentData: Partial<CommentData>): Promise<Comment | null> {
        const index = this.comments.findIndex(comment => comment.id === id);
        if (index === -1) return Promise.resolve(null);

        const existing = this.comments[index];
        const updated = new Comment({ ...existing, ...commentData });
        this.comments[index] = updated;

        return Promise.resolve(updated);
    }

    async delete(id:string): Promise<boolean> {
        const index = this.comments.findIndex(comment => comment.id === id);
        if (index === -1) return Promise.resolve(false);

        this.comments.splice(index, 1);
        return Promise.resolve(true);
    }

    async count(): Promise<number> {
        return Promise.resolve(this.comments.length);
    }

    async countByAuthorId(authorId:string): Promise<number> {
        return Promise.resolve(this.comments.filter(comment => comment.authorId === authorId).length);
    }

    async countByPostId(postId:string): Promise<number> {
        return Promise.resolve(this.comments.filter(comment => comment.postId === postId).length);
    }

    private async populateComments(comments: Comment[]): Promise<Comment[]> {
        if (!this.userRepository) return comments;

        return Promise.all(comments.map(async (comment) => {
            const commentData: any = { ...comment };

            if (typeof comment.authorId === "string") {
                const author = await this.userRepository!.findById(comment.authorId);

                if (author) {
                    commentData.authorId = {
                        id: author.id,
                        name: author.name,
                        firstName: author.firstName,
                        profilePicture: author.profilePicture
                    };
                }
            }

            return new Comment(commentData as CommentData);
        }));
    }
}