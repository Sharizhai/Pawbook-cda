import {CreateAPostReportUseCase} from "$application/use-cases/report/CreateAPostReportUseCase";
import {GetAllPostReportsUseCase} from "$application/use-cases/report/GetAllPostReportsUseCase";
import {APIResponse} from "$utils/responseUtils.utils";
import {Request, Response} from "express";

/**
 * PostReportController - Couche Présentation
 * Gère les requêtes HTTP relatives aux signalements de posts de Pawbook
 */

export class PostReportController {
    constructor(
        private readonly createAPostReportUseCase: CreateAPostReportUseCase,
        private readonly getAllPostReportsUseCase: GetAllPostReportsUseCase
    ) {}

    /**
     * Crée un nouveau signalement de post
     */
    async createPostReport(req: Request, res: Response) {
        try {
            const postReport = await this.createAPostReportUseCase.execute(req.body);

            const payload = {
                id: postReport.id,
                postId: postReport.postId,
                reporterId: postReport.reporterId,
                reason: postReport.reason,
                description: postReport.description,
                createdAt: postReport.createdAt,
                ...(postReport.reporter && {
                    reporter: {
                        id: postReport.reporter.id,
                        name: postReport.reporter.name,
                        firstName: postReport.reporter.firstName,
                        profilePicture: postReport.reporter.profilePicture,
                    }
                }),
                ...(postReport.post && {
                    post: {
                        id: postReport.post.id,
                        authorId: postReport.post.authorId,
                        textContent: postReport.post.textContent,
                        photoContent: postReport.post.photoContent,
                        reportCount: postReport.post.reportCount,
                        moderationStatus: postReport.post.moderationStatus,
                        ...(postReport.post.author && {
                            author: {
                                id: postReport.post.author.id,
                                name: postReport.post.author.name,
                                firstName: postReport.post.author.firstName,
                                profilePicture: postReport.post.author.profilePicture,
                            }
                        })
                    }
                })
            };

            return APIResponse(res, payload, "Nouveau signalement créé avec succès, 201")

        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur lors de la création du signalement";

            return APIResponse(res, null, message, 500);
        }
    }

    /**
     * Récupère tous les signalements de post
     */

    async getAllPostReports(req: Request, res: Response) {
        try {
            const page = Math.max(parseInt(req.query.page as string) || 1, 1);
            const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

            const result = await this.getAllPostReportsUseCase.execute(page, limit);

            const mapped = {
                hasMore: result.hasMore,
                postReports: result.postReports.map((p: any) => ({
                    id: p.id,
                    postId: p.postId,
                    reporterId: p.reporterId,
                    reason: p.reason,
                    description: p.description,
                    createdAt: p.createdAt,
                    ...(p.reporter && {
                        reporter: {
                            id: p.reporter.id,
                            name: p.reporter.name,
                            firstName: p.reporter.firstName,
                            profilePicture: p.reporter.profilePicture,
                        }
                    }),
                    ...(p.post && {
                        post: {
                            id: p.post.id,
                            authorId: p.post.authorId,
                            textContent: p.post.textContent,
                            photoContent: p.post.photoContent,
                            reportCount: p.post.reportCount,
                            moderationStatus: p.post.moderationStatus,
                            ...(p.post.author && {
                                author: {
                                    id: p.post.author.id,
                                    name: p.post.author.name,
                                    firstName: p.post.author.firstName,
                                    profilePicture: p.post.author.profilePicture,
                                }
                            })
                        }
                    })
                }))
            }

            return APIResponse(res, mapped, "Signalements de posts récupérés avec succès");
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Erreur lors de la récupération des posts";

            return APIResponse(res, null, message, 500);
        }
    }
}