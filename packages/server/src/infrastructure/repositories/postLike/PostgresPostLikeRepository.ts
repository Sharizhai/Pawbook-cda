import {IPostLikeRepository} from "$domain/interfaces/repositories/like/postLikeRepository.interface";
import {PrismaClient} from "@prisma/client";
import {PostLike, PostLikeData} from "$domain/entities/PostLike";

export class PostgresPostLikeRepository implements IPostLikeRepository {
    constructor(private prisma: PrismaClient) {}

    async findAllByPostId(postId: string): Promise<PostLike[]> {
        const postLikes = await this.prisma.postLike.findMany({
            where: { postId },
        });

        return postLikes.map(postLike => this.toDomain(postLike));
    }

    async findById(id: string): Promise<PostLike | null> {
        const postlike = await this.prisma.postLike.findUnique({
            where: { id },
        })

        return postlike ? this.toDomain(postlike) : null;
    }

    async findByAuthorAndPost(authorId:string, postId:string): Promise<PostLike | null> {
        const postLike =  await this.prisma.postLike.findUnique({
                where: {
                    authorId_postId: {
                        authorId,
                        postId
                    }
                }
            });

        return postLike ? this.toDomain(postLike) : null;
    }

    async save(postLike: PostLike): Promise<PostLike> {
        const saved = await this.prisma.postLike.create({
            data: {
                id: postLike.id,
                authorId: postLike.authorId,
                postId: postLike.postId,
                createdAt: postLike.createdAt,
            }
        });

        return this.toDomain(saved);
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.postLike.delete({
                where: { id }
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async count(): Promise<number> {
        return await this.prisma.postLike.count();
    }

    async countByPostId(postId: string): Promise<number> {
        return this.prisma.postLike.count({
            where: { postId }
        });
    }

    async countByAuthorId(authorId: string): Promise<number> {
        return this.prisma.postLike.count({
            where: { authorId }
        });
    }

    /**
     * Convertit un follow Prisma en entité Follow du domaine
     */
    private toDomain(prismaPostLike: any): PostLike {
        return new PostLike({
            id: prismaPostLike.id,
            authorId: prismaPostLike.authorId,
            postId: prismaPostLike.postId,
            createdAt: prismaPostLike.createdAt
        });
    }
}