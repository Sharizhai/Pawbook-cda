import {IPostReportRepository} from "$domain/interfaces/repositories/reports/postReportRepository.interface";
import {PostReport, PostReportData} from "$domain/entities/PostReports";
import {PrismaClient} from "@prisma/client";

export class PostgresPostReportRepository implements IPostReportRepository {
    constructor(private prisma: PrismaClient) {}

    private readonly POST_REPORT_INCLUDE = {
        post: {
            select: {
                id: true,
                authorId: true,
                textContent: true,
                photoContent: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        firstName: true,
                        profilePicture: true
                    }
                }
            }
        }
    } as const;

    async findAll(page: number, limit: number): Promise<PostReport[]> {
        const safePage = Math.max(page, 1);
        const skip = (safePage - 1) * limit;

        const reports = await this.prisma.$queryRaw<any[]>`
            SELECT * FROM "PostReport"
            ORDER BY
                CASE
                    WHEN reason IN ('HATE_SPEECH', 'VIOLENCE', 'SEXUAL_CONTENT', 'ANIMAL_ABUSE', 'SELF_HARM')
                        THEN 0
                    ELSE 1
                    END,
                "createdAt" ASC
                LIMIT ${limit}
            OFFSET ${skip}
        `;

        return reports.map(report => this.toDomain(report));
    }

    async findById(id: string): Promise<PostReport | null> {
        const post = await this.prisma.postReport.findUnique({
            where: { id },
            include: this.POST_REPORT_INCLUDE
        });

        return post ? this.toDomain(post) : null;
    }

    async findByReporterId(reporterId: string, page: number, limit: number): Promise<PostReport[]> {
        const safePage = Math.max(page, 1);
        const skip = (safePage - 1) * limit;
        const posts = await this.prisma.postReport.findMany({
            where: { reporterId },
            include: this.POST_REPORT_INCLUDE,
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        });

        return posts.map(post => this.toDomain(post));
    }

    async findByPostAuthorId(postAuthorId: string, page: number, limit: number): Promise<PostReport[]> {
        const safePage = Math.max(page, 1);
        const skip = (safePage - 1) * limit;

        const reports = await this.prisma.postReport.findMany({
            where: {
                post: {
                    authorId: postAuthorId
                }
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: this.POST_REPORT_INCLUDE
        });

        return reports.map(report => this.toDomain(report));
    }

    async save(postReport: PostReport): Promise<PostReport> {
        const saved = await this.prisma.$transaction(async (tx) => {
            await tx.post.update({
                where: { id: postReport.postId },
                data: {
                    reportCount: { increment: 1 },
                    moderationStatus: "PENDING"
                }
            });

            return await tx.postReport.create({
                data: {
                    id: postReport.id,
                    postId: postReport.postId,
                    reporterId: postReport.reporterId,
                    reason: postReport.reason,
                    description: postReport.description,
                    createdAt: postReport.createdAt
                },
                include: this.POST_REPORT_INCLUDE
            });
        });

        return this.toDomain(saved);
    }

    async update(id: string, postReportData: Partial<PostReportData>): Promise<PostReport | null> {
        try {
            // Exclut les champs de relation et les champs non modifiables
            const { postId, reporterId, post, createdAt, ...updateData } = postReportData;

            const updatedReport = await this.prisma.postReport.update({
                where: { id },
                data: updateData,
                include: this.POST_REPORT_INCLUDE
            });

            return this.toDomain(updatedReport);
        } catch (error) {
            return null;
        }
    }

    private toDomain(prismaReportPost: any): PostReport {
        return new PostReport({
            id: prismaReportPost.id,
            postId: prismaReportPost.postId,
            reporterId: prismaReportPost.reporterId,
            post: prismaReportPost.post ? {
                id: prismaReportPost.post.id,
                authorId: prismaReportPost.post.authorId,
                textContent: prismaReportPost.post.textContent,
                photoContent: prismaReportPost.post.photoContent,
                reportCount: prismaReportPost.post.reportCount,
                moderationStatus: prismaReportPost.post.moderationStatus,
                author: prismaReportPost.post.author ? {
                    id: prismaReportPost.post.author.id,
                    name: prismaReportPost.post.author.name,
                    firstName: prismaReportPost.post.author.firstName,
                    profilePicture: prismaReportPost.post.author.profilePicture ?? null,
                } : undefined
            } : undefined,
            reason: prismaReportPost.reason,
            description: prismaReportPost.description,
            createdAt: prismaReportPost.createdAt
        });
    }
}