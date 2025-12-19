import {IPostRepository} from "$domain/interfaces/repositories/postRepository.interface";
import {Post, PostData} from "$domain/entities/Posts";
import {PrismaClient} from "@prisma/client";

export class PostgresPostRepository implements IPostRepository {
    constructor(private prisma: PrismaClient) {}

    private readonly POST_INCLUDE = {
        author: {
            select: {
                id: true,
                name: true,
                firstName: true,
                profilePicture: true
            }
        }
    } as const;

    async findAll(page: number, limit: number): Promise<Post[]> {
        const safePage = Math.max(page, 1);
        const skip = (safePage - 1) * limit;

        const posts = await this.prisma.post.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: this.POST_INCLUDE
        });

        return posts.map(post => this.toDomain(post));
    }

    async findById(id: string): Promise<Post | null> {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: this.POST_INCLUDE
        });

        return post ? this.toDomain(post) : null;
    }

    async findByAuthorId(authorId: string, page: number, limit: number): Promise<Post[]> {
        const safePage = Math.max(page, 1);
        const skip = (safePage - 1) * limit;
        const posts = await this.prisma.post.findMany({
            where: { authorId },
            include: this.POST_INCLUDE,
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        });

        return posts.map(post => this.toDomain(post));
    }

    async save(post: Post): Promise<Post> {
        // Upsert = create or update
        const saved = await this.prisma.post.upsert({
            where: { id: post.id },
            create: {
                id: post.id,
                authorId: post.authorId,
                textContent: post.textContent ?? null,
                photoContent: post.photoContent ?? [],
                createdAt: post.createdAt
            },
            update: {
                textContent: post.textContent ?? null,
                photoContent: post.photoContent ?? [],
                updatedAt: new Date()
            },
            include: this.POST_INCLUDE
        });

        return this.toDomain(saved);
    }

    async update(id: string, postData: Partial<PostData>): Promise<Post | null> {
        try {
            // Exclut les champs de relation (gérés par Prisma automatiquement)
            const { authorId, author, ...updateData } = postData;

            const post = await this.prisma.post.update({
                where: { id },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                },
                include: this.POST_INCLUDE
            });

            return this.toDomain(post);
        } catch (error) {
            return null;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.post.delete({
                where: { id }
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async count(): Promise<number> {
        return await this.prisma.post.count();
    }

    /**
     * Convertit un post Prisma en entité Post du domaine
     */
    private toDomain(prismaPost: any): Post {
        return new Post({
            id: prismaPost.id,
            authorId: prismaPost.authorId ?? prismaPost.author?.id,
            author: prismaPost.author
                ? {
                    id: prismaPost.author.id,
                    name: prismaPost.author.name,
                    firstName: prismaPost.author.firstName,
                    profilePicture: prismaPost.author.profilePicture ?? null,
                }
                : undefined,
            textContent: prismaPost.textContent ?? undefined,
            photoContent: prismaPost.photoContent ?? [],
            reportCount: prismaPost.reportCount,
            moderationStatus: prismaPost.moderationStatus,
            createdAt: prismaPost.createdAt,
            updatedAt: prismaPost.updatedAt
        });
    }
}