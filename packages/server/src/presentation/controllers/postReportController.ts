import {CreateAPostReportUseCase} from "$application/use-cases/report/CreateAPostReportUseCase";
import {APIResponse} from "$utils/responseUtils.utils";
import {Request, Response} from "express";

/**
 * PostReportController - Couche Présentation
 * Gère les requêtes HTTP relatives aux signalements de posts de Pawbook
 */

export class PostReportController {
    constructor(
        private readonly createAPostReportUseCase: CreateAPostReportUseCase,
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
}